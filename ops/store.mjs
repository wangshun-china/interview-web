import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { hashPassword, newCsrfToken, newSessionToken, tokenDigest, verifyPassword } from './security.mjs'

function nowIso() {
  return new Date().toISOString()
}

function parseJson(value, fallback = null) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export class OpsStore {
  constructor({ dataDir, initialUsername = 'admin', initialPassword }) {
    fs.mkdirSync(dataDir, { recursive: true, mode: 0o700 })
    this.db = new DatabaseSync(path.join(dataDir, 'ops.sqlite'))
    this.db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;')
    this.#migrate()
    this.#ensureInitialUser(initialUsername, initialPassword)
  }

  #migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS _meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `)
    const version = Number(this.db.prepare("SELECT value FROM _meta WHERE key = 'schema_version'").get()?.value ?? 0)

    if (version < 1) {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS sessions (
          token_hash TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          csrf_token TEXT NOT NULL,
          expires_at TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS routes (
          id INTEGER PRIMARY KEY,
          domain TEXT NOT NULL UNIQUE,
          target_host TEXT NOT NULL,
          target_port INTEGER NOT NULL,
          protocol TEXT NOT NULL,
          health_path TEXT NOT NULL,
          tls INTEGER NOT NULL DEFAULT 0,
          enabled INTEGER NOT NULL DEFAULT 1,
          apply_state TEXT NOT NULL DEFAULT 'staged',
          apply_message TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS tunnels (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          local_host TEXT NOT NULL,
          local_port INTEGER NOT NULL,
          remote_port INTEGER NOT NULL UNIQUE,
          protocol TEXT NOT NULL,
          enabled INTEGER NOT NULL DEFAULT 1,
          sync_state TEXT NOT NULL DEFAULT 'pending',
          sync_message TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS agents (
          id TEXT PRIMARY KEY,
          hostname TEXT NOT NULL,
          last_seen TEXT NOT NULL,
          payload TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY,
          agent_id TEXT NOT NULL,
          type TEXT NOT NULL,
          payload TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          result TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS job_runs (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          status TEXT NOT NULL,
          message TEXT NOT NULL DEFAULT '',
          occurred_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS audit_log (
          id INTEGER PRIMARY KEY,
          username TEXT NOT NULL,
          action TEXT NOT NULL,
          target TEXT NOT NULL,
          details TEXT NOT NULL,
          ip TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_tasks_agent_status ON tasks(agent_id, status);
        CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_jobs_occurred ON job_runs(occurred_at DESC);
      `)
      this.db.prepare("INSERT OR REPLACE INTO _meta (key, value) VALUES ('schema_version', '1')").run()
    }

    if (version < 2) {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS singbox_outbounds (
          id INTEGER PRIMARY KEY,
          tag TEXT NOT NULL UNIQUE,
          type TEXT NOT NULL,
          server TEXT NOT NULL,
          server_port INTEGER NOT NULL,
          protocol_settings TEXT NOT NULL DEFAULT '{}',
          tls_settings TEXT NOT NULL DEFAULT '{}',
          transport_settings TEXT NOT NULL DEFAULT '{}',
          group_tag TEXT NOT NULL DEFAULT 'proxy',
          priority INTEGER NOT NULL DEFAULT 0,
          enabled INTEGER NOT NULL DEFAULT 1,
          is_default INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_sb_outbounds_group ON singbox_outbounds(group_tag, priority);
      `)
      this.db.prepare("INSERT OR REPLACE INTO _meta (key, value) VALUES ('schema_version', '2')").run()
    }
  }

  #ensureInitialUser(username, password) {
    const count = this.db.prepare('SELECT COUNT(*) AS count FROM users').get().count
    if (count > 0) return
    if (!password) throw new Error('OPS_INITIAL_PASSWORD is required when initializing the Ops database')
    const timestamp = nowIso()
    this.db.prepare(`
      INSERT INTO users (username, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `).run(username, hashPassword(password), timestamp, timestamp)
  }

  authenticate(username, password) {
    const user = this.db.prepare('SELECT * FROM users WHERE username = ?').get(username)
    if (!user || !verifyPassword(password, user.password_hash)) return null
    return { id: user.id, username: user.username }
  }

  createSession(userId, ttlMs) {
    const token = newSessionToken()
    const csrfToken = newCsrfToken()
    const createdAt = nowIso()
    const expiresAt = new Date(Date.now() + ttlMs).toISOString()
    this.db.prepare(`
      INSERT INTO sessions (token_hash, user_id, csrf_token, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(tokenDigest(token), userId, csrfToken, expiresAt, createdAt)
    return { token, csrfToken, expiresAt }
  }

  getSession(token) {
    if (!token) return null
    this.db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(nowIso())
    return this.db.prepare(`
      SELECT sessions.token_hash, sessions.csrf_token, sessions.expires_at,
             users.id AS user_id, users.username
      FROM sessions JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ? AND sessions.expires_at > ?
    `).get(tokenDigest(token), nowIso()) ?? null
  }

  deleteSession(token) {
    if (token) this.db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenDigest(token))
  }

  changePassword(userId, currentPassword, nextPassword) {
    const user = this.db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
    if (!user || !verifyPassword(currentPassword, user.password_hash)) return false
    this.db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?')
      .run(hashPassword(nextPassword), nowIso(), userId)
    this.db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId)
    return true
  }

  listRoutes() {
    return this.db.prepare('SELECT * FROM routes ORDER BY domain').all().map(this.#mapRoute)
  }

  getRoute(id) {
    const row = this.db.prepare('SELECT * FROM routes WHERE id = ?').get(id)
    return row ? this.#mapRoute(row) : null
  }

  saveRoute(route, id = null) {
    const timestamp = nowIso()
    if (id) {
      this.db.prepare(`
        UPDATE routes SET domain = ?, target_host = ?, target_port = ?, protocol = ?,
          health_path = ?, tls = ?, enabled = ?, apply_state = 'staged', apply_message = '', updated_at = ?
        WHERE id = ?
      `).run(route.domain, route.targetHost, route.targetPort, route.protocol, route.healthPath,
        Number(route.tls), Number(route.enabled), timestamp, id)
      return this.getRoute(id)
    }
    const result = this.db.prepare(`
      INSERT INTO routes (domain, target_host, target_port, protocol, health_path, tls, enabled, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(route.domain, route.targetHost, route.targetPort, route.protocol, route.healthPath,
      Number(route.tls), Number(route.enabled), timestamp, timestamp)
    return this.getRoute(Number(result.lastInsertRowid))
  }

  deleteRoute(id) {
    const route = this.getRoute(id)
    if (route) this.db.prepare('DELETE FROM routes WHERE id = ?').run(id)
    return route
  }

  setRouteApplyState(id, state, message = '') {
    this.db.prepare('UPDATE routes SET apply_state = ?, apply_message = ?, updated_at = ? WHERE id = ?')
      .run(state, message.slice(0, 1000), nowIso(), id)
  }

  #mapRoute(row) {
    return {
      id: row.id,
      domain: row.domain,
      targetHost: row.target_host,
      targetPort: row.target_port,
      protocol: row.protocol,
      healthPath: row.health_path,
      tls: Boolean(row.tls),
      enabled: Boolean(row.enabled),
      applyState: row.apply_state,
      applyMessage: row.apply_message,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }

  listTunnels() {
    return this.db.prepare('SELECT * FROM tunnels ORDER BY name').all().map(this.#mapTunnel)
  }

  getTunnel(id) {
    const row = this.db.prepare('SELECT * FROM tunnels WHERE id = ?').get(id)
    return row ? this.#mapTunnel(row) : null
  }

  saveTunnel(tunnel, id = null) {
    const timestamp = nowIso()
    if (id) {
      this.db.prepare(`
        UPDATE tunnels SET name = ?, local_host = ?, local_port = ?, remote_port = ?, protocol = ?,
          enabled = ?, sync_state = 'pending', sync_message = '', updated_at = ? WHERE id = ?
      `).run(tunnel.name, tunnel.localHost, tunnel.localPort, tunnel.remotePort, tunnel.protocol,
        Number(tunnel.enabled), timestamp, id)
      return this.getTunnel(id)
    }
    const result = this.db.prepare(`
      INSERT INTO tunnels (name, local_host, local_port, remote_port, protocol, enabled, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(tunnel.name, tunnel.localHost, tunnel.localPort, tunnel.remotePort, tunnel.protocol,
      Number(tunnel.enabled), timestamp, timestamp)
    return this.getTunnel(Number(result.lastInsertRowid))
  }

  deleteTunnel(id) {
    const tunnel = this.getTunnel(id)
    if (tunnel) this.db.prepare('DELETE FROM tunnels WHERE id = ?').run(id)
    return tunnel
  }

  setAllTunnelSyncState(state, message = '') {
    this.db.prepare('UPDATE tunnels SET sync_state = ?, sync_message = ?, updated_at = ?')
      .run(state, message.slice(0, 1000), nowIso())
  }

  #mapTunnel(row) {
    return {
      id: row.id,
      name: row.name,
      localHost: row.local_host,
      localPort: row.local_port,
      remotePort: row.remote_port,
      protocol: row.protocol,
      enabled: Boolean(row.enabled),
      syncState: row.sync_state,
      syncMessage: row.sync_message,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }

  upsertAgent(id, payload) {
    const timestamp = nowIso()
    this.db.prepare(`
      INSERT INTO agents (id, hostname, last_seen, payload) VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET hostname = excluded.hostname, last_seen = excluded.last_seen, payload = excluded.payload
    `).run(id, String(payload.hostname || id), timestamp, JSON.stringify(payload))
    return this.getAgent(id)
  }

  getAgent(id) {
    const row = this.db.prepare('SELECT * FROM agents WHERE id = ?').get(id)
    if (!row) return null
    return { id: row.id, hostname: row.hostname, lastSeen: row.last_seen, payload: parseJson(row.payload, {}) }
  }

  isAgentOnline(id, ttlMs) {
    const agent = this.getAgent(id)
    return Boolean(agent && Date.now() - Date.parse(agent.lastSeen) <= ttlMs)
  }

  enqueueTunnelSync(agentId = 'wsl') {
    this.db.prepare("UPDATE tasks SET status = 'superseded', updated_at = ? WHERE agent_id = ? AND type = 'sync-frpc' AND status = 'pending'")
      .run(nowIso(), agentId)
    const payload = { tunnels: this.listTunnels().filter((item) => item.enabled) }
    const timestamp = nowIso()
    const result = this.db.prepare(`
      INSERT INTO tasks (agent_id, type, payload, status, created_at, updated_at)
      VALUES (?, 'sync-frpc', ?, 'pending', ?, ?)
    `).run(agentId, JSON.stringify(payload), timestamp, timestamp)
    return Number(result.lastInsertRowid)
  }

  enqueueAgentTask(agentId, type, payload) {
    const timestamp = nowIso()
    const result = this.db.prepare(`
      INSERT INTO tasks (agent_id, type, payload, status, created_at, updated_at)
      VALUES (?, ?, ?, 'pending', ?, ?)
    `).run(agentId, type, JSON.stringify(payload), timestamp, timestamp)
    return Number(result.lastInsertRowid)
  }

  pendingTasks(agentId) {
    return this.db.prepare(`
      SELECT * FROM tasks WHERE agent_id = ? AND status = 'pending' ORDER BY id LIMIT 10
    `).all(agentId).map((row) => ({
      id: row.id,
      type: row.type,
      payload: parseJson(row.payload, {}),
      createdAt: row.created_at
    }))
  }

  claimPendingTasks(agentId) {
    const tasks = this.pendingTasks(agentId)
    if (!tasks.length) return tasks
    const timestamp = nowIso()
    const update = this.db.prepare("UPDATE tasks SET status = 'running', updated_at = ? WHERE id = ? AND status = 'pending'")
    const claimed = []
    this.db.exec('BEGIN IMMEDIATE')
    try {
      for (const task of tasks) {
        if (update.run(timestamp, task.id).changes) claimed.push(task)
      }
      this.db.exec('COMMIT')
      return claimed
    } catch (error) {
      this.db.exec('ROLLBACK')
      throw error
    }
  }

  completeTask(agentId, id, status, result = '') {
    const task = this.db.prepare('SELECT * FROM tasks WHERE id = ? AND agent_id = ?').get(id, agentId)
    if (!task) return false
    const finalStatus = status === 'success' ? 'success' : 'failed'
    this.db.prepare('UPDATE tasks SET status = ?, result = ?, updated_at = ? WHERE id = ?')
      .run(finalStatus, String(result).slice(0, 2000), nowIso(), id)
    if (task.type === 'sync-frpc') this.setAllTunnelSyncState(finalStatus, result)
    return true
  }

  recordJob(name, status, message = '') {
    this.db.prepare('INSERT INTO job_runs (name, status, message, occurred_at) VALUES (?, ?, ?, ?)')
      .run(String(name).slice(0, 100), String(status).slice(0, 30), String(message).slice(0, 1000), nowIso())
  }

  listJobs(limit = 20) {
    return this.db.prepare('SELECT * FROM job_runs ORDER BY occurred_at DESC LIMIT ?').all(limit).map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      message: row.message,
      occurredAt: row.occurred_at
    }))
  }

  audit(username, action, target, details, ip) {
    this.db.prepare(`
      INSERT INTO audit_log (username, action, target, details, ip, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(username, action, target, JSON.stringify(details ?? {}), ip, nowIso())
  }

  listAudit(limit = 50) {
    return this.db.prepare('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?').all(limit).map((row) => ({
      id: row.id,
      username: row.username,
      action: row.action,
      target: row.target,
      details: parseJson(row.details, {}),
      ip: row.ip,
      createdAt: row.created_at
    }))
  }

  close() {
    this.db.close()
  }

  walCheckpoint() {
    try { this.db.exec('PRAGMA wal_checkpoint(TRUNCATE);') } catch {}
  }

  listOutbounds() {
    return this.db.prepare('SELECT * FROM singbox_outbounds ORDER BY group_tag, priority').all().map(this.#mapOutbound)
  }

  getOutbound(id) {
    const row = this.db.prepare('SELECT * FROM singbox_outbounds WHERE id = ?').get(id)
    return row ? this.#mapOutbound(row) : null
  }

  getOutboundByTag(tag) {
    const row = this.db.prepare('SELECT * FROM singbox_outbounds WHERE tag = ?').get(tag)
    return row ? this.#mapOutbound(row) : null
  }

  saveOutbound(outbound, id = null) {
    const timestamp = nowIso()
    if (id) {
      this.db.prepare(`
        UPDATE singbox_outbounds SET tag = ?, type = ?, server = ?, server_port = ?,
          protocol_settings = ?, tls_settings = ?, transport_settings = ?, group_tag = ?,
          priority = ?, enabled = ?, is_default = ?, updated_at = ?
        WHERE id = ?
      `).run(outbound.tag, outbound.type, outbound.server, outbound.serverPort,
        outbound.protocolSettings, outbound.tlsSettings, outbound.transportSettings,
        outbound.groupTag, outbound.priority, Number(outbound.enabled),
        Number(outbound.isDefault), timestamp, id)
      return this.getOutbound(id)
    }
    const result = this.db.prepare(`
      INSERT INTO singbox_outbounds (tag, type, server, server_port,
        protocol_settings, tls_settings, transport_settings, group_tag,
        priority, enabled, is_default, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(outbound.tag, outbound.type, outbound.server, outbound.serverPort,
      outbound.protocolSettings, outbound.tlsSettings, outbound.transportSettings,
      outbound.groupTag, outbound.priority, Number(outbound.enabled),
      Number(outbound.isDefault), timestamp, timestamp)
    return this.getOutbound(Number(result.lastInsertRowid))
  }

  deleteOutbound(id) {
    const outbound = this.getOutbound(id)
    if (outbound) this.db.prepare('DELETE FROM singbox_outbounds WHERE id = ?').run(id)
    return outbound
  }

  setOutboundEnabled(id, enabled) {
    this.db.prepare('UPDATE singbox_outbounds SET enabled = ?, updated_at = ? WHERE id = ?')
      .run(Number(enabled), nowIso(), id)
  }

  selectDefaultOutbound(groupTag, tag) {
    this.db.exec('BEGIN IMMEDIATE')
    try {
      this.db.prepare('UPDATE singbox_outbounds SET is_default = 0 WHERE group_tag = ?').run(groupTag)
      this.db.prepare('UPDATE singbox_outbounds SET is_default = 1, updated_at = ? WHERE tag = ? AND group_tag = ?')
        .run(nowIso(), tag, groupTag)
      this.db.exec('COMMIT')
    } catch (error) {
      this.db.exec('ROLLBACK')
      throw error
    }
  }

  #mapOutbound(row) {
    const parse = (v, d) => { try { return JSON.parse(v) } catch { return d } }
    return {
      id: row.id,
      tag: row.tag,
      type: row.type,
      server: row.server,
      serverPort: row.server_port,
      protocolSettings: parse(row.protocol_settings, {}),
      tlsSettings: parse(row.tls_settings, {}),
      transportSettings: parse(row.transport_settings, {}),
      groupTag: row.group_tag,
      priority: row.priority,
      enabled: Boolean(row.enabled),
      isDefault: Boolean(row.is_default),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }
}
