import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { Buffer } from 'node:buffer'
import { execFile } from 'node:child_process'
import tls from 'node:tls'
import { promisify } from 'node:util'
import { assertSafeRoutePath, renderRouteConfig, summarizeTraffic } from './core.mjs'

const execFileAsync = promisify(execFile)

function dockerRequest(socketPath, requestPath, method = 'GET') {
  return new Promise((resolve, reject) => {
    const request = http.request({
      socketPath,
      method,
      path: requestPath
    }, (response) => {
      const chunks = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', () => {
        const data = Buffer.concat(chunks)
        if ((response.statusCode ?? 500) >= 300) {
          const statusCode = response.statusCode === 304 ? 409 : response.statusCode
          reject(Object.assign(new Error(`Docker API ${response.statusCode}: ${data.toString('utf8').slice(0, 500)}`), { statusCode }))
          return
        }
        resolve(data)
      })
    })
    request.setTimeout(5000, () => request.destroy(new Error('Docker API timeout')))
    request.on('error', reject)
    request.end()
  })
}

export class DockerClient {
  constructor(socketPath = '/var/run/docker.sock') {
    this.socketPath = socketPath
  }

  available() {
    return fs.existsSync(this.socketPath)
  }

  async listContainers() {
    if (!this.available()) return { available: false, containers: [], message: 'Docker socket unavailable' }
    const data = await dockerRequest(this.socketPath, '/containers/json?all=1')
    const rows = JSON.parse(data.toString('utf8'))
    return {
      available: true,
      containers: rows.map((row) => ({
        id: row.Id,
        shortId: row.Id.slice(0, 12),
        name: String(row.Names?.[0] ?? '').replace(/^\//, ''),
        image: row.Image,
        state: row.State,
        status: row.Status,
        protected: row.Labels?.['wangshun.ops.protected'] === 'true',
        ports: (row.Ports ?? []).map((port) => ({
          privatePort: port.PrivatePort,
          publicPort: port.PublicPort ?? null,
          type: port.Type,
          ip: port.IP ?? null
        }))
      }))
    }
  }

  async action(containerId, action) {
    const id = String(containerId)
    if (!/^[a-f0-9]{64}$/i.test(id)) {
      throw Object.assign(new Error('容器 ID 格式无效'), { statusCode: 400 })
    }
    const endpoints = {
      start: { method: 'POST', path: `/containers/${id}/start` },
      stop: { method: 'POST', path: `/containers/${id}/stop?t=10` },
      restart: { method: 'POST', path: `/containers/${id}/restart?t=10` },
      delete: { method: 'DELETE', path: `/containers/${id}?force=0&v=0` }
    }
    const endpoint = endpoints[action]
    if (!endpoint) throw Object.assign(new Error('不支持的 Docker 操作'), { statusCode: 400 })
    if (!this.available()) throw Object.assign(new Error('Docker socket 不可用'), { statusCode: 503 })
    await dockerRequest(this.socketPath, endpoint.path, endpoint.method)
  }

}

export class LocalNginxController {
  constructor(binary = 'nginx') {
    this.binary = binary
  }

  async validate() {
    try {
      const { stdout, stderr } = await execFileAsync(this.binary, ['-t'], { timeout: 10_000 })
      return [stdout, stderr].filter(Boolean).join('\n').trim()
    } catch (error) {
      throw new Error([error.stdout, error.stderr, error.message].filter(Boolean).join('\n').trim())
    }
  }

  async reload() {
    try {
      await execFileAsync(this.binary, ['-s', 'reload'], { timeout: 10_000 })
    } catch (error) {
      throw new Error([error.stdout, error.stderr, error.message].filter(Boolean).join('\n').trim())
    }
  }
}

export class RouteManager {
  constructor({ routeDir, nginxController = new LocalNginxController(), applyEnabled = false }) {
    this.routeDir = routeDir
    this.nginxController = nginxController
    this.applyEnabled = applyEnabled
    fs.mkdirSync(routeDir, { recursive: true, mode: 0o700 })
  }

  async apply(route) {
    const file = assertSafeRoutePath(this.routeDir, route.domain)
    const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
    if (route.enabled) {
      const temporary = `${file}.next`
      fs.writeFileSync(temporary, renderRouteConfig(route), { mode: 0o600 })
      fs.renameSync(temporary, file)
    } else if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    }

    if (!this.applyEnabled) return { state: 'staged', message: `本地安全模式：配置已写入 ${path.basename(file)}，未重载 Nginx` }

    try {
      if (route.enabled) {
        const upstream = `${route.protocol}://${route.targetHost}:${route.targetPort}${route.healthPath}`
        try {
          await fetch(upstream, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(5000) })
        } catch (error) {
          throw Object.assign(new Error(`目标服务健康检查失败：${error.message}`), { statusCode: 502 })
        }
      }
      const validation = await this.nginxController.validate()
      await this.nginxController.reload()
      return { state: 'applied', message: validation || 'Nginx configuration reloaded' }
    } catch (error) {
      if (previous == null) fs.rmSync(file, { force: true })
      else fs.writeFileSync(file, previous, { mode: 0o600 })
      throw error
    }
  }

  async remove(domain) {
    const file = assertSafeRoutePath(this.routeDir, domain)
    if (!fs.existsSync(file)) return { state: 'removed', message: '路由配置不存在或已经删除' }
    const previous = fs.readFileSync(file, 'utf8')
    fs.unlinkSync(file)
    if (!this.applyEnabled) return { state: 'removed', message: '本地安全模式：配置文件已删除，未重载 Nginx' }
    try {
      const validation = await this.nginxController.validate()
      await this.nginxController.reload()
      return { state: 'removed', message: validation || 'Nginx configuration reloaded' }
    } catch (error) {
      fs.writeFileSync(file, previous, { mode: 0o600 })
      throw error
    }
  }
}

async function probeService(service) {
  const startedAt = Date.now()
  try {
    const response = await fetch(service.url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(service.timeoutMs ?? 5000),
      headers: { 'User-Agent': 'wangshun-ops/1.0' }
    })
    const body = service.keyword ? await response.text() : ''
    const keywordOk = !service.keyword || body.includes(service.keyword)
    return {
      ...service,
      online: response.ok && keywordOk,
      status: response.status,
      latencyMs: Date.now() - startedAt,
      message: keywordOk ? response.statusText : '响应内容不符合预期'
    }
  } catch (error) {
    return { ...service, online: false, status: null, latencyMs: Date.now() - startedAt, message: error.message }
  }
}

export async function collectServices(services) {
  return Promise.all(services.map(probeService))
}

export function collectCertificate(hostname, port = 443) {
  return new Promise((resolve) => {
    const socket = tls.connect({ host: hostname, port, servername: hostname, timeout: 5000, rejectUnauthorized: false }, () => {
      const certificate = socket.getPeerCertificate()
      socket.end()
      const expiresAt = certificate.valid_to ? new Date(certificate.valid_to).toISOString() : null
      resolve({
        hostname,
        available: Boolean(expiresAt),
        expiresAt,
        daysRemaining: expiresAt ? Math.floor((Date.parse(expiresAt) - Date.now()) / 86400000) : null,
        issuer: certificate.issuer?.O ?? certificate.issuer?.CN ?? ''
      })
    })
    socket.on('timeout', () => socket.destroy(new Error('TLS timeout')))
    socket.on('error', (error) => resolve({ hostname, available: false, message: error.message }))
  })
}

function readTail(file, maxBytes = 2 * 1024 * 1024) {
  if (!fs.existsSync(file)) return []
  const stat = fs.statSync(file)
  const start = Math.max(0, stat.size - maxBytes)
  const length = stat.size - start
  if (length <= 0) return []
  const descriptor = fs.openSync(file, 'r')
  try {
    const buffer = Buffer.alloc(length)
    fs.readSync(descriptor, buffer, 0, length, start)
    const text = buffer.toString('utf8')
    const lines = text.split(/\r?\n/)
    if (start > 0) lines.shift()
    return lines
  } finally {
    fs.closeSync(descriptor)
  }
}

export function collectTraffic(accessLog) {
  if (!fs.existsSync(accessLog)) return { available: false, hosts: [], message: 'Nginx access log unavailable' }
  return { available: true, hosts: summarizeTraffic(readTail(accessLog)) }
}

export function collectNginxBindings(configFile) {
  if (!fs.existsSync(configFile)) return []
  const config = fs.readFileSync(configFile, 'utf8')
  const blocks = []
  const serverPattern = /\bserver\s*\{/g
  for (let match = serverPattern.exec(config); match; match = serverPattern.exec(config)) {
    const start = config.indexOf('{', match.index)
    let depth = 0
    for (let index = start; index < config.length; index += 1) {
      if (config[index] === '{') depth += 1
      if (config[index] === '}') depth -= 1
      if (depth === 0) {
        blocks.push(config.slice(start + 1, index))
        serverPattern.lastIndex = index + 1
        break
      }
    }
  }
  return blocks.flatMap((block) => {
    const names = /\bserver_name\s+([^;]+);/.exec(block)?.[1].trim().split(/\s+/) ?? []
    const upstream = /\bproxy_pass\s+(https?):\/\/([^/:\s;]+)(?::(\d+))?/.exec(block)
    if (!upstream) return []
    return names.filter((domain) => /^(?:[a-z0-9_-]+\.)?wangshun\.work$/i.test(domain)).map((domain) => ({
      domain,
      protocol: upstream[1],
      targetHost: upstream[2],
      targetPort: Number(upstream[3] || (upstream[1] === 'https' ? 443 : 80)),
      tls: /\blisten\s+443\b/.test(block),
      source: 'nginx'
    }))
  })
}

const SINGBOX_CONTAINER = 'sing-box'

function hostGateway() {
  const ifaces = os.networkInterfaces()
  for (const name of Object.keys(ifaces)) {
    if (!name.startsWith('eth')) continue
    for (const addr of ifaces[name]) {
      if (addr.family === 'IPv4' && !addr.internal) {
        return addr.address.replace(/\.\d+$/, '.1')
      }
    }
  }
  return '172.17.0.1'
}
const SINGBOX_CLASH_API = process.env.OPS_SINGBOX_API || `http://${hostGateway()}:9090`

export class SingboxController {
  constructor(dockerBinary = 'docker', containerName = SINGBOX_CONTAINER) {
    this.dockerBinary = dockerBinary
    this.containerName = containerName
  }

  async fetchApi(path) {
    const res = await fetch(`${SINGBOX_CLASH_API}${path}`, { signal: AbortSignal.timeout(5000) })
    const text = await res.text()
    try { return JSON.parse(text) } catch { return { raw: text } }
  }

  async status() {
    try {
      const data = await this.fetchApi('/proxies')
      if (data?.proxies) return { running: true, container: this.containerName }
      return { running: false, error: 'unexpected API response', container: this.containerName }
    } catch (error) {
      return { running: false, error: error.message.slice(0, 200), container: this.containerName }
    }
  }

  async groups() {
    const data = await this.fetchApi('/proxies')
    return data?.proxies ?? {}
  }

  async groupDetail(tag) {
    return this.fetchApi(`/proxies/${encodeURIComponent(tag)}`)
  }

  async selectNode(groupTag, outboundTag) {
    const res = await fetch(`${SINGBOX_CLASH_API}/proxies/${encodeURIComponent(groupTag)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: outboundTag }),
      signal: AbortSignal.timeout(5000)
    })
    if (!res.ok) throw new Error(`节点切换失败: HTTP ${res.status}`)
    return { ok: true, group: groupTag, outbound: outboundTag }
  }

  async connections() {
    return this.fetchApi('/connections')
  }

  async killConnection(id) {
    const res = await fetch(`${SINGBOX_CLASH_API}/connections/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(5000)
    })
    if (!res.ok) throw new Error(`关闭连接失败: HTTP ${res.status}`)
    return { ok: true, id }
  }

  async traffic() {
    return this.fetchApi('/traffic')
  }

  async checkConfig() {
    return { valid: true, message: 'config validation not available via HTTP API' }
  }

  async reload() {
    return { ok: true, message: 'reload via HTTP API not available, use docker restart sing-box on host' }
  }

  async testDelay(outboundTag, testUrl = 'https://www.gstatic.com/generate_204', timeout = 5000) {
    try {
      const res = await fetch(
        `${SINGBOX_CLASH_API}/proxies/${encodeURIComponent(outboundTag)}/delay?url=${encodeURIComponent(testUrl)}&timeout=${timeout}`,
        { signal: AbortSignal.timeout(timeout + 2000) }
      )
      const data = await res.json()
      return { ok: true, latencyMs: data.delay ?? 0 }
    } catch (error) {
      return { ok: false, latencyMs: 0, error: error.message.slice(0, 200) }
    }
  }
}
