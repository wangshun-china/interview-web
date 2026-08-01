import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import test from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'

test('npm development entry starts the Ops API and Vite on the documented ports', async (context) => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wangshun-ops-vite-'))
  const projectRoot = path.resolve(import.meta.dirname, '..', '..')
  const child = spawn(process.execPath, ['scripts/dev.mjs'], {
    cwd: projectRoot,
    env: {
      ...process.env,
      OPS_DATA_DIR: dataDir,
      OPS_ROUTE_DIR: path.join(dataDir, 'routes'),
      OPS_NGINX_ACCESS_LOG: path.join(dataDir, 'access.log'),
      OPS_SERVICES_JSON: '[]',
      OPS_INITIAL_PASSWORD: 'wangshun',
      OPS_AGENT_TOKEN: 'test-agent-token'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  })
  let output = ''
  child.stdout.on('data', (chunk) => { output += chunk })
  child.stderr.on('data', (chunk) => { output += chunk })
  context.after(async () => {
    if (child.exitCode == null && child.signalCode == null) {
      child.kill()
      await Promise.race([once(child, 'exit'), delay(5000)])
    }
    fs.rmSync(dataDir, { recursive: true, force: true })
  })

  const base = 'http://127.0.0.1:5173'
  let ready = false
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (child.exitCode != null || child.signalCode != null) break
    try {
      const response = await fetch(`${base}/api/ops/health`)
      if (response.ok) { ready = true; break }
    } catch {
      await delay(100)
    }
  }
  assert.equal(ready, true, `development server did not become ready:\n${output}`)
  const page = await fetch(`${base}/ops`).then((response) => response.text())
  assert.match(page, /<div id="app"><\/div>/)
  const health = await fetch(`${base}/api/ops/health`).then((response) => response.json())
  assert.equal(health.service, 'wangshun-ops')
  const login = await fetch(`${base}/api/ops/auth/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wangshun' })
  })
  assert.equal(login.status, 200)
  assert.equal((await login.json()).user.username, 'admin')
})
