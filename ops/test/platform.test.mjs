import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { RouteManager } from '../platform.mjs'

test('production route apply probes upstream, validates nginx and rolls back failures', async (context) => {
  const routeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wangshun-routes-'))
  const calls = []
  const nginxController = {
    async validate() { calls.push('validate'); return 'syntax ok' },
    async reload() { calls.push('reload') }
  }
  const manager = new RouteManager({ routeDir, nginxController, applyEnabled: true })
  const upstream = http.createServer((_request, response) => { response.writeHead(204); response.end() })
  await new Promise((resolve) => upstream.listen(0, '127.0.0.1', resolve))
  context.after(() => fs.rmSync(routeDir, { recursive: true, force: true }))
  const port = upstream.address().port
  const route = { domain: 'live.wangshun.work', targetHost: '127.0.0.1', targetPort: port, protocol: 'http', healthPath: '/', tls: false, enabled: true }
  const result = await manager.apply(route)
  assert.equal(result.state, 'applied')
  assert.deepEqual(calls, ['validate', 'reload'])
  assert.ok(fs.existsSync(path.join(routeDir, 'live.wangshun.work.conf')))
  await new Promise((resolve) => upstream.close(resolve))

  const failedRoute = { ...route, domain: 'offline.wangshun.work' }
  await assert.rejects(manager.apply(failedRoute), (error) => error.statusCode === 502)
  assert.equal(fs.existsSync(path.join(routeDir, 'offline.wangshun.work.conf')), false)
})
