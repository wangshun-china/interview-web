import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { createOpsServer } from '../server.mjs'

test('authenticated route management and WSL-gated tunnel workflow', async (context) => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wangshun-ops-test-'))
  const dockerActions = []
  const aliyunContainerId = 'a'.repeat(64)
  const wslContainerId = 'b'.repeat(64)
  const app = createOpsServer({
    host: '127.0.0.1', port: 0, dataDir, routeDir: path.join(dataDir, 'routes'),
    accessLog: path.join(dataDir, 'access.log'), services: [], initialPassword: 'wangshun',
    agentToken: 'test-agent-token', cookieSecure: false, applyRoutes: false,
    dockerClient: {
      listContainers: async () => ({ available: true, containers: [{ id: aliyunContainerId, name: 'demo-api', state: 'running' }] }),
      action: async (containerId, action) => dockerActions.push({ containerId, action })
    }
  })
  await app.listen()
  context.after(async () => { await app.close(); fs.rmSync(dataDir, { recursive: true, force: true }) })
  const address = app.server.address()
  const base = `http://127.0.0.1:${address.port}/api/ops`
  let cookie = ''
  let csrf = ''

  async function request(endpoint, { method = 'GET', body, agent = false } = {}) {
    const headers = {}
    if (body) headers['content-type'] = 'application/json'
    if (cookie) headers.cookie = cookie
    if (csrf && method !== 'GET') headers['x-ops-csrf'] = csrf
    if (agent) headers['x-ops-agent-token'] = 'test-agent-token'
    const response = await fetch(base + endpoint, { method, headers, body: body && JSON.stringify(body) })
    const data = await response.json()
    return { response, data }
  }

  let result = await request('/auth/login', { method: 'POST', body: { username: 'admin', password: 'wrong' } })
  assert.equal(result.response.status, 401)
  result = await request('/auth/login', { method: 'POST', body: { username: 'admin', password: 'wangshun' } })
  assert.equal(result.response.status, 200)
  cookie = result.response.headers.get('set-cookie').split(';')[0]
  csrf = result.data.csrfToken

  result = await request('/docker/actions', { method: 'POST', body: { target: 'aliyun', containerId: aliyunContainerId, action: 'restart' } })
  assert.equal(result.response.status, 200)
  assert.deepEqual(dockerActions, [{ containerId: aliyunContainerId, action: 'restart' }])
  result = await request('/docker/actions', { method: 'POST', body: { target: 'aliyun', containerId: aliyunContainerId, action: 'delete', confirmName: 'demo-api' } })
  assert.equal(result.response.status, 409)

  result = await request('/routes', { method: 'POST', body: { domain: 'demo.wangshun.work', targetHost: 'host.docker.internal', targetPort: 20000, protocol: 'http', healthPath: '/', tls: false } })
  assert.equal(result.response.status, 201)
  assert.equal(result.data.route.applyState, 'staged')
  assert.match(fs.readFileSync(path.join(dataDir, 'routes', 'demo.wangshun.work.conf'), 'utf8'), /host\.docker\.internal:20000/)

  result = await request('/routes', { method: 'POST', body: { domain: 'ops.wangshun.work', targetPort: 20001 } })
  assert.equal(result.response.status, 400)

  result = await request('/tunnels', { method: 'POST', body: { name: 'demo-tunnel', localPort: 10001, remotePort: 20001 } })
  assert.equal(result.response.status, 409)
  result = await request('/agent/heartbeat', { method: 'POST', agent: true, body: { id: 'wsl', hostname: 'test-wsl', frpcActive: true, proxies: [], containers: [{ id: wslContainerId, name: 'wsl-api', state: 'running' }] } })
  assert.equal(result.response.status, 200)
  result = await request('/docker/actions', { method: 'POST', body: { target: 'wsl', containerId: wslContainerId, action: 'stop' } })
  assert.equal(result.response.status, 202)
  result = await request('/agent/tasks?agent=wsl', { agent: true })
  assert.equal(result.data.tasks[0].type, 'docker-action')
  const dockerTaskId = result.data.tasks[0].id
  result = await request('/agent/tasks?agent=other', { agent: true })
  assert.equal(result.data.tasks.length, 0)
  await request(`/agent/tasks/${dockerTaskId}`, { method: 'POST', agent: true, body: { agentId: 'other', status: 'success', result: 'stopped' } })
  result = await request('/tunnels', { method: 'POST', body: { name: 'demo-tunnel', localPort: 10001, remotePort: 20001, protocol: 'tcp' } })
  assert.equal(result.response.status, 202)
  result = await request('/agent/tasks?agent=wsl', { agent: true })
  assert.equal(result.data.tasks.length, 1)
  assert.equal(result.data.tasks[0].type, 'sync-frpc')

  result = await request('/docker/actions', { method: 'POST', body: { target: 'aliyun', containerId: aliyunContainerId, action: 'shell' } })
  assert.equal(result.response.status, 400)

  result = await request('/auth/password', { method: 'POST', body: { currentPassword: 'wangshun', nextPassword: 'a-better-password' } })
  assert.equal(result.response.status, 200)
  result = await request('/auth/me')
  assert.equal(result.response.status, 401)
})
