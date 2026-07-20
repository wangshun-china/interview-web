import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const children = [
  spawn(process.execPath, ['ops/server.mjs'], { cwd: projectRoot, env: process.env, stdio: 'inherit' }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { cwd: projectRoot, env: process.env, stdio: 'inherit' })
]
let stopping = false

function stop(exitCode) {
  if (stopping) return
  stopping = true
  process.exitCode = exitCode
  for (const child of children) {
    if (child.exitCode == null && child.signalCode == null) child.kill()
  }
  setTimeout(() => {
    for (const child of children) {
      if (child.exitCode == null && child.signalCode == null) child.kill('SIGKILL')
    }
  }, 3000).unref()
}

for (const child of children) {
  child.on('error', (error) => {
    console.error(error)
    stop(1)
  })
  child.on('exit', (code, signal) => {
    if (!stopping) {
      console.error(`Local development process exited (${signal || code || 0})`)
      stop(code || 1)
    }
  })
}

process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
