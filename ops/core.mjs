import path from 'node:path'

const RESERVED_SUBDOMAINS = new Set([
  'www',
  'ops',
  'agent',
  'api',
  'api_transfer',
  'rpc',
  'ai-coder'
])

const BLOCKED_PORTS = new Set([2222, 2375, 2376, 3306, 5432, 6379, 7000, 7500, 8787])
const TARGET_HOSTS = new Set(['host.docker.internal', '127.0.0.1', 'agent-quest'])

function validationError(message) {
  return Object.assign(new Error(message), { statusCode: 400 })
}

export function validateDomain(value) {
  const domain = String(value ?? '').trim().toLowerCase()
  const match = /^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)\.wangshun\.work$/.exec(domain)
  if (!match) throw validationError('域名必须是合法的 *.wangshun.work 子域名')
  if (RESERVED_SUBDOMAINS.has(match[1])) throw validationError('该域名由基础网关配置管理，不能在这里覆盖')
  return domain
}

export function validatePort(value) {
  const port = Number(value)
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw validationError('端口必须是 1024 到 65535 之间的整数')
  }
  if (BLOCKED_PORTS.has(port)) throw validationError('该端口属于管理或基础设施端口，禁止绑定')
  return port
}

export function validateTargetHost(value) {
  const host = String(value ?? 'host.docker.internal').trim()
  if (!TARGET_HOSTS.has(host)) throw validationError('目标主机不在允许列表中')
  return host
}

export function validateProtocol(value) {
  const protocol = String(value ?? 'http').toLowerCase()
  if (protocol !== 'http' && protocol !== 'https') throw validationError('上游协议只能是 http 或 https')
  return protocol
}

export function validateHealthPath(value) {
  const healthPath = String(value ?? '/').trim() || '/'
  if (!healthPath.startsWith('/') || healthPath.includes('://') || healthPath.includes('\n')) {
    throw validationError('健康检查路径必须以 / 开头')
  }
  return healthPath.slice(0, 200)
}

export function validateTunnelName(value) {
  const name = String(value ?? '').trim().toLowerCase()
  if (!/^[a-z0-9][a-z0-9-]{1,48}$/.test(name)) {
    throw validationError('穿透名称只能包含小写字母、数字和连字符')
  }
  return name
}

export function normalizeRoute(input) {
  return {
    domain: validateDomain(input.domain),
    targetHost: validateTargetHost(input.targetHost),
    targetPort: validatePort(input.targetPort),
    protocol: validateProtocol(input.protocol),
    healthPath: validateHealthPath(input.healthPath),
    tls: Boolean(input.tls),
    enabled: input.enabled !== false
  }
}

export function normalizeTunnel(input) {
  return {
    name: validateTunnelName(input.name),
    localHost: '127.0.0.1',
    localPort: validatePort(input.localPort),
    remotePort: validatePort(input.remotePort),
    protocol: input.protocol === 'udp' ? 'udp' : 'tcp',
    enabled: input.enabled !== false
  }
}

export function routeFilename(domain) {
  return `${validateDomain(domain)}.conf`
}

function proxyLocation(route) {
  const websocketHeaders = `
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";`
  return `    location / {
        proxy_pass ${route.protocol}://${route.targetHost}:${route.targetPort};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;${websocketHeaders}
    }`
}

export function renderRouteConfig(input) {
  const route = normalizeRoute(input)
  const acme = `    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }`
  const httpServer = route.tls
    ? `server {
    listen 80;
    server_name ${route.domain};

${acme}

    location / {
        return 301 https://$host$request_uri;
    }
}`
    : `server {
    listen 80;
    server_name ${route.domain};

${acme}

${proxyLocation(route)}
}`

  const httpsServer = route.tls
    ? `

server {
    listen 443 ssl;
    http2 on;
    server_name ${route.domain};
    ssl_certificate /etc/letsencrypt/live/wangshun.work/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wangshun.work/privkey.pem;

${proxyLocation(route)}
}`
    : ''

  return `# Managed by Wangshun Ops. Manual edits will be replaced.\n${httpServer}${httpsServer}\n`
}

export function assertSafeRoutePath(routeDir, domain) {
  const resolvedDir = path.resolve(routeDir)
  const filename = routeFilename(domain)
  const resolvedFile = path.resolve(resolvedDir, filename)
  if (path.dirname(resolvedFile) !== resolvedDir) throw new Error('非法路由文件路径')
  if (filename.includes('\0') || filename.includes('..')) throw new Error('非法路由文件路径')
  return resolvedFile
}

export function domainConflicts(domain, staticRoutes) {
  const lower = domain.toLowerCase()
  for (const route of staticRoutes) {
    if (route.domain.toLowerCase() === lower) return route.domain
  }
  return null
}

export function summarizeTraffic(lines, now = Date.now()) {
  const since = now - 24 * 60 * 60 * 1000
  const hosts = new Map()
  for (const line of lines) {
    if (!line.trim()) continue
    let entry
    try {
      entry = JSON.parse(line)
    } catch {
      continue
    }
    const timestamp = Date.parse(entry.time)
    if (!Number.isFinite(timestamp) || timestamp < since) continue
    const host = String(entry.host || 'unknown')
    const current = hosts.get(host) ?? {
      host,
      requests: 0,
      success: 0,
      clientErrors: 0,
      serverErrors: 0,
      totalRequestTime: 0,
      referrers: new Map()
    }
    current.requests += 1
    const status = Number(entry.status)
    if (status >= 200 && status < 400) current.success += 1
    else if (status >= 400 && status < 500) current.clientErrors += 1
    else if (status >= 500) current.serverErrors += 1
    current.totalRequestTime += Number(entry.request_time) || 0
    const referrer = String(entry.referrer || '')
    if (referrer && referrer !== '-') {
      let source = referrer
      try {
        source = new URL(referrer).hostname
      } catch {
        source = 'other'
      }
      current.referrers.set(source, (current.referrers.get(source) ?? 0) + 1)
    }
    hosts.set(host, current)
  }

  return [...hosts.values()].map((item) => ({
    host: item.host,
    requests: item.requests,
    success: item.success,
    clientErrors: item.clientErrors,
    serverErrors: item.serverErrors,
    averageRequestTime: item.requests ? Number((item.totalRequestTime / item.requests).toFixed(3)) : 0,
    referrers: [...item.referrers.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }))
  }))
}

export function renderSingboxConfig(outbounds) {
  const entries = outbounds.filter((o) => o.enabled)
  const groups = new Map()
  for (const outbound of entries) {
    const list = groups.get(outbound.groupTag) ?? []
    list.push(outbound)
    groups.set(outbound.groupTag, list)
  }
  const outboundEntries = entries.map((o) => buildOutboundEntry(o))
  const groupBlocks = []
  for (const [tag, members] of groups) {
    const defaultNode = members.find((o) => o.isDefault) ?? members[0]
    groupBlocks.push(`{
    "tag": "${tag}",
    "type": "selector",
    "outbounds": [${members.map((o) => JSON.stringify(o.tag)).join(', ')}],
    "default": ${JSON.stringify(defaultNode?.tag ?? members[0]?.tag ?? '')}
  }`)
  }
  return `{
  "outbounds": [
${outboundEntries.join(',\n')}
  ],
  "route": {
    "rules": [
      {
        "protocol": "dns",
        "outbound": "dns-out"
      }
    ],
    "auto_detect_interface": true
  },
  "experimental": {
    "clash_api": {
      "external_controller": "0.0.0.0:9090",
      "secret": ""
    }
  }
}
`
}

function buildOutboundEntry(o) {
  const base = {
    tag: o.tag,
    type: o.type,
    server: o.server,
    server_port: o.serverPort
  }
  Object.assign(base, o.protocolSettings)
  if (Object.keys(o.tlsSettings).length) base.tls = o.tlsSettings
  if (Object.keys(o.transportSettings).length) base.transport = o.transportSettings
  return JSON.stringify(base, null, 4)
}
