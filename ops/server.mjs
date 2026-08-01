import http from 'node:http'
import path from 'node:path'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { normalizeRoute, normalizeTunnel, validateDomain, domainConflicts } from './core.mjs'
import { collectCertificate, collectNginxBindings, collectServices, collectTraffic, DockerClient, LocalNginxController, RouteManager, SingboxController } from './platform.mjs'
import { parseCookies, safeTokenEqual } from './security.mjs'
import { OpsStore } from './store.mjs'

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(MODULE_DIR, '..')
const API_PREFIX = '/api/ops'
const DOCKER_ACTIONS = new Set(['start', 'stop', 'restart', 'delete'])
const PROTECTED_CONTAINERS = new Set(['wangshun-portfolio'])

const DEFAULT_SERVICES = [
  { name: '简历主页', url: 'https://wangshun.work/' },
  { name: 'Agent Quest', url: 'https://agent.wangshun.work/' },
  { name: 'API 中转站', url: 'http://api_transfer.wangshun.work/' },
  { name: 'Memoir API', url: 'https://api.wangshun.work/health', keyword: 'memoir-server' },
  { name: 'Lumina RPC', url: 'https://rpc.wangshun.work/' },
  { name: 'AI Coder', url: 'https://ai-coder.wangshun.work/' },
  { name: '管理后台', url: 'https://ops.wangshun.work/' }
]

function booleanEnv(value, fallback = false) {
  if (value == null || value === '') return fallback
  return /^(1|true|yes)$/i.test(value)
}

function defaultConfig(overrides = {}) {
  const production = process.env.NODE_ENV === 'production'
  const initialPassword = process.env.OPS_INITIAL_PASSWORD || (production ? '' : 'wangshun')
  if (!initialPassword) throw new Error('OPS_INITIAL_PASSWORD must be configured in production')
  const agentToken = process.env.OPS_AGENT_TOKEN || (production ? '' : 'dev-agent-token')
  if (!agentToken) throw new Error('OPS_AGENT_TOKEN must be configured in production')
  let services = DEFAULT_SERVICES
  if (process.env.OPS_SERVICES_JSON) services = JSON.parse(process.env.OPS_SERVICES_JSON)
  return {
    host: process.env.OPS_HOST || '127.0.0.1',
    port: Number(process.env.OPS_PORT || 8787),
    dataDir: process.env.OPS_DATA_DIR || path.join(PROJECT_ROOT, 'ops-data'),
    routeDir: process.env.OPS_ROUTE_DIR || path.join(PROJECT_ROOT, 'ops-data', 'routes'),
    accessLog: process.env.OPS_NGINX_ACCESS_LOG || path.join(PROJECT_ROOT, 'ops-data', 'access.log'),
    dockerSocket: process.env.OPS_DOCKER_SOCKET || '/var/run/docker.sock',
    nginxBinary: process.env.OPS_NGINX_BINARY || 'nginx',
    nginxConfig: process.env.OPS_NGINX_CONFIG || path.join(PROJECT_ROOT, 'deploy', 'nginx-https.conf'),
    applyRoutes: booleanEnv(process.env.OPS_APPLY_ROUTES, false),
    cookieSecure: booleanEnv(process.env.OPS_COOKIE_SECURE, production),
    initialUsername: process.env.OPS_INITIAL_USERNAME || 'admin',
    initialPassword,
    agentToken,
    sessionTtlMs: Number(process.env.OPS_SESSION_TTL_MS || 12 * 60 * 60 * 1000),
    agentTtlMs: Number(process.env.OPS_AGENT_TTL_MS || 90_000),
    services,
    ...overrides
  }
}

function sendJson(response, status, body, headers = {}) {
  if (response.writableEnded) return
  try {
    const payload = Buffer.from(JSON.stringify(body))
    response.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': payload.length,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      ...headers
    })
    response.end(payload)
  } catch {}
}

function cleanupLoginAttempts(attempts, ttlMs = 30 * 60 * 1000) {
  const cutoff = Date.now() - ttlMs
  for (const [ip, entry] of attempts) {
    if (entry.blockedUntil < Date.now() && entry.count === 0) {
      if (attempts.size > 5000) attempts.delete(ip)
    } else if (entry.blockedUntil < Date.now() && entry.blockedUntil !== 0) {
      attempts.delete(ip)
    }
  }
  for (const [ip, entry] of attempts) {
    if (entry.blockedUntil < cutoff) attempts.delete(ip)
  }
}

async function readJson(request, maxBytes = 64 * 1024) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > maxBytes) throw Object.assign(new Error('请求内容过大'), { statusCode: 413 })
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw Object.assign(new Error('请求 JSON 格式错误'), { statusCode: 400 })
  }
}

function requestIp(request) {
  const forwarded = request.headers['x-forwarded-for']
  return String(Array.isArray(forwarded) ? forwarded[0] : forwarded ?? request.socket.remoteAddress ?? '')
    .split(',')[0]
    .trim()
}

function routeId(pathname, collection) {
  const match = new RegExp(`^${API_PREFIX}/${collection}/(\\d+)$`).exec(pathname)
  return match ? Number(match[1]) : null
}

function validateOutbound(input) {
  const tag = String(input.tag ?? '').trim()
  if (!/^[a-z0-9][a-z0-9-]{0,48}$/.test(tag)) throw Object.assign(new Error('节点标签只能包含小写字母、数字和连字符'), { statusCode: 400 })
  const type = String(input.type ?? '')
  if (!/^[a-z][a-z0-9]{1,20}$/.test(type)) throw Object.assign(new Error('无效的协议类型'), { statusCode: 400 })
  const server = String(input.server ?? '').trim()
  if (!/^[a-z0-9][a-z0-9.-]{0,253}$/i.test(server)) throw Object.assign(new Error('无效的服务器地址'), { statusCode: 400 })
  const serverPort = Number(input.serverPort)
  if (!Number.isInteger(serverPort) || serverPort < 1 || serverPort > 65535) throw Object.assign(new Error('无效的端口号'), { statusCode: 400 })
  return {
    tag, type, server, serverPort,
    protocolSettings: typeof input.protocolSettings === 'object' ? JSON.stringify(input.protocolSettings) : '{}',
    tlsSettings: typeof input.tlsSettings === 'object' ? JSON.stringify(input.tlsSettings) : '{}',
    transportSettings: typeof input.transportSettings === 'object' ? JSON.stringify(input.transportSettings) : '{}',
    groupTag: String(input.groupTag || 'proxy').trim().slice(0, 100),
    priority: Number(input.priority ?? 0),
    enabled: input.enabled !== false,
    isDefault: Boolean(input.isDefault)
  }
}

function agentTaskId(pathname) {
  const match = new RegExp(`^${API_PREFIX}/agent/tasks/(\\d+)$`).exec(pathname)
  return match ? Number(match[1]) : null
}

function authSession(store, request) {
  return store.getSession(parseCookies(request.headers.cookie).ops_session)
}

function requireCsrf(request, session) {
  if (request.method === 'GET' || request.method === 'HEAD') return
  if (!safeTokenEqual(request.headers['x-ops-csrf'] ?? '', session.csrf_token)) {
    throw Object.assign(new Error('CSRF 校验失败，请刷新后重试'), { statusCode: 403 })
  }
}

function sessionCookie(token, config) {
  const secure = config.cookieSecure ? '; Secure' : ''
  return `ops_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(config.sessionTtlMs / 1000)}${secure}`
}

function clearSessionCookie(config) {
  const secure = config.cookieSecure ? '; Secure' : ''
  return `ops_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`
}

export function createOpsServer(overrides = {}) {
  const config = defaultConfig(overrides)
  const store = overrides.store ?? new OpsStore(config)
  const docker = overrides.dockerClient ?? new DockerClient(config.dockerSocket)
  const nginxController = overrides.nginxController ?? new LocalNginxController(config.nginxBinary)
  const routeManager = overrides.routeManager ?? new RouteManager({
    routeDir: config.routeDir,
    nginxController,
    applyEnabled: config.applyRoutes
  })
  const singbox = overrides.singboxController ?? new SingboxController()
  const loginAttempts = new Map()
  let dashboardCache = null

  async function dashboard() {
    if (dashboardCache && Date.now() - dashboardCache.createdAt < 30_000) return dashboardCache.value
    const agent = store.getAgent('wsl')
    const wslOnline = store.isAgentOnline('wsl', config.agentTtlMs)
    const [services, certificate, dockerResult] = await Promise.all([
      collectServices(config.services),
      config.services.length ? collectCertificate('wangshun.work') : Promise.resolve({ available: false }),
      docker.listContainers().catch((error) => ({ available: false, containers: [], message: error.message }))
    ])
    const value = {
      generatedAt: new Date().toISOString(),
      services,
      certificate,
      docker: dockerResult,
      wsl: {
        online: wslOnline,
        lastSeen: agent?.lastSeen ?? null,
        hostname: agent?.hostname ?? null,
        frpcActive: Boolean(agent?.payload?.frpcActive),
        proxies: agent?.payload?.proxies ?? [],
        containers: agent?.payload?.containers ?? []
      },
      traffic: collectTraffic(config.accessLog),
      jobs: store.listJobs(),
      audit: store.listAudit(20),
      counts: { routes: store.listRoutes().length, tunnels: store.listTunnels().length }
    }
    dashboardCache = { createdAt: Date.now(), value }
    return value
  }

  function requireAgent(request) {
    const token = request.headers['x-ops-agent-token'] ?? ''
    if (!safeTokenEqual(token, config.agentToken)) {
      throw Object.assign(new Error('Agent token 无效'), { statusCode: 401 })
    }
  }

  function requireWslOnline() {
    if (!store.isAgentOnline('wsl', config.agentTtlMs)) {
      throw Object.assign(new Error('WSL 当前离线，禁止修改内网穿透配置'), { statusCode: 409 })
    }
  }

  function normalizeDockerAction(body) {
    const target = String(body.target ?? '')
    const containerId = String(body.containerId ?? '')
    const action = String(body.action ?? '')
    if (!['aliyun', 'wsl'].includes(target)) {
      throw Object.assign(new Error('Docker 目标必须是 aliyun 或 wsl'), { statusCode: 400 })
    }
    if (!/^[a-f0-9]{64}$/i.test(containerId)) {
      throw Object.assign(new Error('容器 ID 格式无效'), { statusCode: 400 })
    }
    if (!DOCKER_ACTIONS.has(action)) {
      throw Object.assign(new Error('不支持的 Docker 操作'), { statusCode: 400 })
    }
    return { target, containerId, action, confirmName: String(body.confirmName ?? '') }
  }

  async function handler(request, response) {
    let closed = false
    request.on('error', () => { closed = true })
    response.on('close', () => { closed = true })
    const url = new URL(request.url ?? '/', `http://${request.headers.host || 'localhost'}`)
    const pathname = url.pathname.replace(/\/$/, '') || '/'
    try {
      if (closed) return
      if (pathname === `${API_PREFIX}/health` && request.method === 'GET') {
        sendJson(response, 200, { status: 'ok', service: 'wangshun-ops' })
        return
      }

      if (pathname === `${API_PREFIX}/auth/login` && request.method === 'POST') {
        const ip = requestIp(request)
        const attempts = loginAttempts.get(ip) ?? { count: 0, blockedUntil: 0 }
        if (attempts.blockedUntil > Date.now()) {
          throw Object.assign(new Error('登录失败次数过多，请稍后再试'), { statusCode: 429 })
        }
        const body = await readJson(request)
        const user = store.authenticate(String(body.username ?? ''), String(body.password ?? ''))
        if (!user) {
          attempts.count += 1
          if (attempts.count >= 5) {
            attempts.blockedUntil = Date.now() + 15 * 60 * 1000
            attempts.count = 0
          }
          loginAttempts.set(ip, attempts)
          throw Object.assign(new Error('账号或密码错误'), { statusCode: 401 })
        }
        loginAttempts.delete(ip)
        const session = store.createSession(user.id, config.sessionTtlMs)
        store.audit(user.username, 'login', 'session', {}, ip)
        sendJson(response, 200, { user, csrfToken: session.csrfToken, expiresAt: session.expiresAt }, {
          'Set-Cookie': sessionCookie(session.token, config)
        })
        return
      }

      if (pathname.startsWith(`${API_PREFIX}/agent/`)) {
        requireAgent(request)
        if (pathname === `${API_PREFIX}/agent/heartbeat` && request.method === 'POST') {
          const body = await readJson(request)
          const agent = store.upsertAgent('wsl', { ...body, id: 'wsl' })
          dashboardCache = null
          sendJson(response, 200, { ok: true, lastSeen: agent.lastSeen })
          return
        }
        if (pathname === `${API_PREFIX}/agent/tasks` && request.method === 'GET') {
          sendJson(response, 200, { tasks: store.claimPendingTasks('wsl') })
          return
        }
        const taskId = agentTaskId(pathname)
        if (taskId && request.method === 'POST') {
          const body = await readJson(request)
          if (!store.completeTask('wsl', taskId, body.status, body.result)) {
            throw Object.assign(new Error('任务不存在'), { statusCode: 404 })
          }
          dashboardCache = null
          sendJson(response, 200, { ok: true })
          return
        }
        if (pathname === `${API_PREFIX}/agent/jobs` && request.method === 'POST') {
          const body = await readJson(request)
          store.recordJob(body.name, body.status, body.message)
          dashboardCache = null
          sendJson(response, 200, { ok: true })
          return
        }
        throw Object.assign(new Error('Agent 接口不存在'), { statusCode: 404 })
      }

      const session = authSession(store, request)
      if (!session) throw Object.assign(new Error('请先登录'), { statusCode: 401 })
      requireCsrf(request, session)
      const username = session.username
      const ip = requestIp(request)

      if (pathname === `${API_PREFIX}/auth/me` && request.method === 'GET') {
        sendJson(response, 200, { user: { id: session.user_id, username }, csrfToken: session.csrf_token, expiresAt: session.expires_at })
        return
      }
      if (pathname === `${API_PREFIX}/auth/logout` && request.method === 'POST') {
        store.deleteSession(parseCookies(request.headers.cookie).ops_session)
        store.audit(username, 'logout', 'session', {}, ip)
        sendJson(response, 200, { ok: true }, { 'Set-Cookie': clearSessionCookie(config) })
        return
      }
      if (pathname === `${API_PREFIX}/auth/password` && request.method === 'POST') {
        const body = await readJson(request)
        if (String(body.nextPassword ?? '').length < 8) {
          throw Object.assign(new Error('新密码至少需要 8 个字符'), { statusCode: 400 })
        }
        if (!store.changePassword(session.user_id, body.currentPassword, body.nextPassword)) {
          throw Object.assign(new Error('当前密码错误'), { statusCode: 400 })
        }
        store.audit(username, 'change-password', 'user', {}, ip)
        sendJson(response, 200, { ok: true }, { 'Set-Cookie': clearSessionCookie(config) })
        return
      }
      if (pathname === `${API_PREFIX}/dashboard` && request.method === 'GET') {
        sendJson(response, 200, await dashboard())
        return
      }
      if (pathname === `${API_PREFIX}/docker/actions` && request.method === 'POST') {
        const command = normalizeDockerAction(await readJson(request))
        const containerList = command.target === 'aliyun'
          ? await docker.listContainers()
          : store.getAgent('wsl')?.payload?.containers ?? []
        if (command.target === 'wsl') requireWslOnline()
        if (command.target === 'aliyun' && !containerList.available) {
          throw Object.assign(new Error(containerList.message || 'Docker socket 不可用'), { statusCode: 503 })
        }
        const container = containerList.containers
          ? containerList.containers.find((item) => item.id === command.containerId)
          : containerList.find((item) => item.id === command.containerId)
        if (!container) throw Object.assign(new Error('容器不存在或状态列表已过期，请刷新后重试'), { statusCode: 404 })
        if (container.protected || PROTECTED_CONTAINERS.has(container.name)) {
          throw Object.assign(new Error('管理后台自身容器不允许在网页中操作'), { statusCode: 409 })
        }
        if (command.action === 'start' && container.state === 'running') {
          throw Object.assign(new Error('容器已在运行'), { statusCode: 409 })
        }
        if (['stop', 'restart'].includes(command.action) && container.state !== 'running') {
          throw Object.assign(new Error('只有运行中的容器才能停止或重启'), { statusCode: 409 })
        }
        if (command.action === 'delete') {
          if (container.state === 'running') throw Object.assign(new Error('请先停止容器再删除'), { statusCode: 409 })
          if (command.confirmName !== container.name) throw Object.assign(new Error('删除确认的容器名不匹配'), { statusCode: 400 })
        }
        if (command.target === 'aliyun') {
          await docker.action(command.containerId, command.action)
          store.audit(username, `docker-${command.action}`, `aliyun:${container.name}`, command, ip)
          dashboardCache = null
          sendJson(response, 200, { ok: true, state: 'completed' })
          return
        }
        const taskId = store.enqueueAgentTask('wsl', 'docker-action', {
          containerId: command.containerId,
          containerName: container.name,
          action: command.action
        })
        store.audit(username, `docker-${command.action}`, `wsl:${container.name}`, { ...command, taskId }, ip)
        sendJson(response, 202, { ok: true, state: 'pending', taskId })
        return
      }
      if (pathname === `${API_PREFIX}/routes` && request.method === 'GET') {
        sendJson(response, 200, {
          routes: store.listRoutes(),
          staticRoutes: collectNginxBindings(config.nginxConfig),
          applyEnabled: config.applyRoutes
        })
        return
      }
      if (pathname === `${API_PREFIX}/routes` && request.method === 'POST') {
        const route = normalizeRoute(await readJson(request))
        const conflict = domainConflicts(route.domain, collectNginxBindings(config.nginxConfig))
        if (conflict) throw Object.assign(new Error(`域名 ${route.domain} 已被 Nginx 静态配置 ${conflict} 占用`), { statusCode: 409 })
        const saved = store.saveRoute(route)
        try {
          const applied = await routeManager.apply(saved)
          store.setRouteApplyState(saved.id, applied.state, applied.message)
        } catch (error) {
          store.setRouteApplyState(saved.id, 'failed', error.message)
          throw error
        }
        store.audit(username, 'create-route', saved.domain, saved, ip)
        dashboardCache = null
        sendJson(response, 201, { route: store.getRoute(saved.id) })
        return
      }
      const currentRouteId = routeId(pathname, 'routes')
      if (currentRouteId && request.method === 'PUT') {
        if (!store.getRoute(currentRouteId)) throw Object.assign(new Error('路由不存在'), { statusCode: 404 })
        const route = normalizeRoute(await readJson(request))
        const conflict = domainConflicts(route.domain, collectNginxBindings(config.nginxConfig))
        if (conflict) throw Object.assign(new Error(`域名 ${route.domain} 已被 Nginx 静态配置 ${conflict} 占用`), { statusCode: 409 })
        const saved = store.saveRoute(route, currentRouteId)
        try {
          const applied = await routeManager.apply(saved)
          store.setRouteApplyState(saved.id, applied.state, applied.message)
        } catch (error) {
          store.setRouteApplyState(saved.id, 'failed', error.message)
          throw error
        }
        store.audit(username, 'update-route', saved.domain, saved, ip)
        dashboardCache = null
        sendJson(response, 200, { route: store.getRoute(saved.id) })
        return
      }
      if (currentRouteId && request.method === 'DELETE') {
        const existing = store.getRoute(currentRouteId)
        if (!existing) throw Object.assign(new Error('路由不存在'), { statusCode: 404 })
        await routeManager.remove(existing.domain)
        store.deleteRoute(currentRouteId)
        store.audit(username, 'delete-route', existing.domain, existing, ip)
        dashboardCache = null
        sendJson(response, 200, { ok: true })
        return
      }

      if (pathname === `${API_PREFIX}/tunnels` && request.method === 'GET') {
        const agent = store.getAgent('wsl')
        sendJson(response, 200, {
          tunnels: store.listTunnels(),
          wsl: {
            online: store.isAgentOnline('wsl', config.agentTtlMs),
            lastSeen: agent?.lastSeen ?? null,
            proxies: agent?.payload?.proxies ?? []
          }
        })
        return
      }
      if (pathname === `${API_PREFIX}/tunnels` && request.method === 'POST') {
        requireWslOnline()
        const tunnel = normalizeTunnel(await readJson(request))
        const saved = store.saveTunnel(tunnel)
        const taskId = store.enqueueTunnelSync('wsl')
        store.audit(username, 'create-tunnel', saved.name, { ...saved, taskId }, ip)
        dashboardCache = null
        sendJson(response, 202, { tunnel: saved, taskId })
        return
      }
      const currentTunnelId = routeId(pathname, 'tunnels')
      if (currentTunnelId && request.method === 'PUT') {
        requireWslOnline()
        if (!store.getTunnel(currentTunnelId)) throw Object.assign(new Error('穿透配置不存在'), { statusCode: 404 })
        const tunnel = normalizeTunnel(await readJson(request))
        const saved = store.saveTunnel(tunnel, currentTunnelId)
        const taskId = store.enqueueTunnelSync('wsl')
        store.audit(username, 'update-tunnel', saved.name, { ...saved, taskId }, ip)
        dashboardCache = null
        sendJson(response, 202, { tunnel: saved, taskId })
        return
      }
      if (currentTunnelId && request.method === 'DELETE') {
        requireWslOnline()
        const existing = store.deleteTunnel(currentTunnelId)
        if (!existing) throw Object.assign(new Error('穿透配置不存在'), { statusCode: 404 })
        const taskId = store.enqueueTunnelSync('wsl')
        store.audit(username, 'delete-tunnel', existing.name, { ...existing, taskId }, ip)
        dashboardCache = null
        sendJson(response, 202, { ok: true, taskId })
        return
      }

      if (pathname === `${API_PREFIX}/audit` && request.method === 'GET') {
        sendJson(response, 200, { audit: store.listAudit(100) })
        return
      }

      if (pathname === `${API_PREFIX}/singbox/status` && request.method === 'GET') {
        const [status, groups] = await Promise.all([
          singbox.status().catch(() => ({ running: false, error: '不可达' })),
          singbox.groups().catch(() => ({}))
        ])
        sendJson(response, 200, {
          ...status,
          groups,
          outbounds: store.listOutbounds()
        })
        return
      }

      if (pathname === `${API_PREFIX}/singbox/groups` && request.method === 'GET') {
        const groups = await singbox.groups().catch(() => ({}))
        sendJson(response, 200, { groups })
        return
      }

      if (pathname.startsWith(`${API_PREFIX}/singbox/groups/`) && pathname.endsWith('/select') && request.method === 'POST') {
        const tag = pathname.slice(`${API_PREFIX}/singbox/groups/`.length, -7)
        if (!tag) throw Object.assign(new Error('缺少策略组标签'), { statusCode: 400 })
        const body = await readJson(request)
        const outbound = String(body.outbound ?? '')
        if (!outbound) throw Object.assign(new Error('缺少出站节点名称'), { statusCode: 400 })
        const result = await singbox.selectNode(tag, outbound)
        store.selectDefaultOutbound(tag, outbound)
        store.audit(username, 'singbox-switch-node', `${tag} → ${outbound}`, { groupTag: tag, outboundTag: outbound }, ip)
        dashboardCache = null
        sendJson(response, 200, result)
        return
      }

      if (pathname.startsWith(`${API_PREFIX}/singbox/groups/`) && pathname.endsWith('/test') && request.method === 'POST') {
        const tag = pathname.slice(`${API_PREFIX}/singbox/groups/`.length, -5)
        if (!tag) throw Object.assign(new Error('缺少策略组标签'), { statusCode: 400 })
        const clashGroups = await singbox.groups().catch(() => ({}))
        const nodeNames = clashGroups[tag]?.all ?? []
        const results = await Promise.all(nodeNames.map(async (name) => {
          const delay = await singbox.testDelay(name).catch(() => ({ ok: false, latencyMs: 0, error: 'timeout' }))
          return { tag: name, ...delay }
        }))
        sendJson(response, 200, { group: tag, results })
        return
      }

      if (pathname === `${API_PREFIX}/singbox/connections` && request.method === 'GET') {
        const conns = await singbox.connections().catch(() => ({}))
        sendJson(response, 200, conns)
        return
      }

      if (pathname === `${API_PREFIX}/singbox/connections/kill` && request.method === 'POST') {
        const body = await readJson(request)
        const connId = String(body.id ?? '')
        if (!connId) throw Object.assign(new Error('缺少连接 ID'), { statusCode: 400 })
        const result = await singbox.killConnection(connId)
        store.audit(username, 'singbox-kill-connection', connId, {}, ip)
        sendJson(response, 200, result)
        return
      }

      if (pathname === `${API_PREFIX}/singbox/traffic` && request.method === 'GET') {
        const traffic = await singbox.traffic().catch(() => ({}))
        sendJson(response, 200, traffic)
        return
      }

      if (pathname === `${API_PREFIX}/singbox/ip` && request.method === 'GET') {
        const ip = await singbox.proxyIP()
        sendJson(response, 200, ip)
        return
      }

      if (pathname === `${API_PREFIX}/singbox/speed` && request.method === 'GET') {
        const speed = await singbox.speedTest()
        sendJson(response, 200, speed)
        return
      }

      if (pathname === `${API_PREFIX}/singbox/outbounds` && request.method === 'GET') {
        sendJson(response, 200, { outbounds: store.listOutbounds() })
        return
      }

      if (pathname === `${API_PREFIX}/singbox/outbounds` && request.method === 'POST') {
        const outbound = validateOutbound(await readJson(request))
        const saved = store.saveOutbound(outbound)
        store.audit(username, 'singbox-create-outbound', saved.tag, saved, ip)
        dashboardCache = null
        sendJson(response, 201, { outbound: saved })
        return
      }

      const obId = routeId(pathname, 'singbox/outbounds')
      if (obId && request.method === 'PUT') {
        if (!store.getOutbound(obId)) throw Object.assign(new Error('出站节点不存在'), { statusCode: 404 })
        const outbound = validateOutbound(await readJson(request))
        const saved = store.saveOutbound(outbound, obId)
        store.audit(username, 'singbox-update-outbound', saved.tag, saved, ip)
        dashboardCache = null
        sendJson(response, 200, { outbound: saved })
        return
      }

      if (obId && request.method === 'DELETE') {
        const existing = store.deleteOutbound(obId)
        if (!existing) throw Object.assign(new Error('出站节点不存在'), { statusCode: 404 })
        store.audit(username, 'singbox-delete-outbound', existing.tag, existing, ip)
        dashboardCache = null
        sendJson(response, 200, { ok: true })
        return
      }

      if (pathname === `${API_PREFIX}/singbox/reload` && request.method === 'POST') {
        const result = await singbox.reload().catch((e) => { throw Object.assign(new Error(`重载失败: ${e.message}`), { statusCode: 502 }) })
        store.audit(username, 'singbox-reload', '', {}, ip)
        dashboardCache = null
        sendJson(response, 200, result)
        return
      }

      throw Object.assign(new Error('接口不存在'), { statusCode: 404 })
    } catch (error) {
      const status = error.statusCode || (String(error.message).includes('UNIQUE constraint failed') ? 409 : 500)
      if (status >= 500) console.error(error)
      sendJson(response, status, { error: error.message || '服务器内部错误' })
    }
  }

  const server = http.createServer({ requestTimeout: 60_000, headersTimeout: 30_000 }, handler)
  const loginAttemptsCleanup = setInterval(() => cleanupLoginAttempts(loginAttempts), 5 * 60 * 1000).unref()
  const walCheckpointInterval = setInterval(() => store.walCheckpoint(), 30 * 60 * 1000).unref()
  return {
    config,
    store,
    server,
    listen() {
      return new Promise((resolve, reject) => {
        server.once('error', reject)
        server.listen(config.port, config.host, () => resolve(server.address()))
      })
    },
    close() {
      return new Promise((resolve) => {
        clearInterval(loginAttemptsCleanup)
        clearInterval(walCheckpointInterval)
        store.walCheckpoint()
        server.close(() => {
          if (!overrides.store) store.close()
          resolve()
        })
      })
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const app = createOpsServer()
  const address = await app.listen()
  console.log(`Wangshun Ops API listening on http://${address.address}:${address.port}`)
  const shutdown = async () => {
    await app.close()
    process.exit(0)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}
