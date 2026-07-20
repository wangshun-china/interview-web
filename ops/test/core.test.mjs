import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeRoute, normalizeTunnel, renderRouteConfig, summarizeTraffic, validateDomain } from '../core.mjs'

test('route validation accepts a normal subdomain and rejects reserved or unsafe values', () => {
  assert.equal(validateDomain('Demo.wangshun.work'), 'demo.wangshun.work')
  assert.throws(() => validateDomain('ops.wangshun.work'), /基础网关/)
  assert.throws(() => validateDomain('evil.example.com'), /wangshun\.work/)
  assert.throws(() => normalizeRoute({ domain: 'demo.wangshun.work', targetHost: 'attacker', targetPort: 20000 }), /允许列表/)
  assert.throws(() => normalizeRoute({ domain: 'demo.wangshun.work', targetPort: 2375 }), /禁止绑定/)
})

test('rendered route is constrained and includes optional TLS server', () => {
  const config = renderRouteConfig({ domain: 'demo.wangshun.work', targetHost: 'host.docker.internal', targetPort: 20000, protocol: 'http', healthPath: '/', tls: true })
  assert.match(config, /server_name demo\.wangshun\.work;/)
  assert.match(config, /proxy_pass http:\/\/host\.docker\.internal:20000;/)
  assert.match(config, /listen 443 ssl;/)
  assert.doesNotMatch(config, /evil/)
})

test('tunnel normalization fixes local host and limits values', () => {
  assert.deepEqual(normalizeTunnel({ name: 'demo-tunnel', localPort: 10001, remotePort: 20001, protocol: 'tcp' }), {
    name: 'demo-tunnel', localHost: '127.0.0.1', localPort: 10001, remotePort: 20001, protocol: 'tcp', enabled: true
  })
  assert.throws(() => normalizeTunnel({ name: 'A', localPort: 10001, remotePort: 20001 }), /穿透名称/)
})

test('traffic summary ignores old and malformed lines and groups referrers', () => {
  const now = Date.now()
  const lines = [
    JSON.stringify({ time: new Date(now - 1000).toISOString(), host: 'rpc.wangshun.work', status: 200, request_time: 0.1, referrer: 'https://google.com/search' }),
    JSON.stringify({ time: new Date(now - 2000).toISOString(), host: 'rpc.wangshun.work', status: 500, request_time: 0.3, referrer: '-' }),
    JSON.stringify({ time: new Date(now - 2 * 86400000).toISOString(), host: 'old', status: 200 }),
    'not-json'
  ]
  assert.deepEqual(summarizeTraffic(lines, now), [{
    host: 'rpc.wangshun.work', requests: 2, success: 1, clientErrors: 0, serverErrors: 1,
    averageRequestTime: 0.2, referrers: [{ source: 'google.com', count: 1 }]
  }])
})
