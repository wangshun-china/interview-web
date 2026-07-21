<template>
  <div class="ops-shell">
    <main v-if="!authenticated" class="login-wrap">
      <form class="login-card" @submit.prevent="login">
        <p class="eyebrow">WANGSHUN OPS</p>
        <h1>管理后台</h1>
        <p class="muted">服务状态、Docker、域名路由与 WSL 内网穿透管理</p>
        <label>账号<input v-model.trim="loginForm.username" autocomplete="username" required /></label>
        <label>密码<input v-model="loginForm.password" type="password" autocomplete="current-password" required /></label>
        <p v-if="error" class="message error">{{ error }}</p>
        <button class="primary" :disabled="busy">{{ busy ? '登录中…' : '登录' }}</button>
        <a class="back" href="https://wangshun.work">返回简历首页</a>
      </form>
    </main>

    <template v-else>
      <header class="topbar">
        <div><span class="brand">Wangshun Ops</span><span class="muted"> / {{ user?.username }}</span></div>
        <div class="top-actions"><button class="ghost" @click="refreshAll">刷新</button><button class="ghost" @click="logout">退出</button></div>
      </header>
      <div class="layout">
        <nav class="nav">
          <button v-for="item in tabs" :key="item.key" :class="{ active: tab === item.key }" @click="tab = item.key">{{ item.label }}</button>
        </nav>
        <main class="content">
          <p v-if="error" class="message error">{{ error }}</p>
          <p v-if="notice" class="message ok">{{ notice }}</p>

          <section v-if="tab === 'overview'">
            <div class="section-head"><div><p class="eyebrow">OVERVIEW</p><h1>运行概览</h1></div><small>更新于 {{ formatTime(dashboard?.generatedAt) }}</small></div>
            <div class="metrics">
              <article class="metric"><span>服务</span><strong>{{ onlineServices }}/{{ dashboard?.services?.length ?? 0 }}</strong><small>在线</small></article>
              <article class="metric"><span>宿主机 Docker</span><strong :class="statusClass(dashboard?.docker?.available)">{{ dashboard?.docker?.available ? '可用' : '不可用' }}</strong><small>{{ dashboard?.docker?.containers?.length ?? 0 }} 个容器</small></article>
              <article class="metric"><span>WSL</span><strong :class="statusClass(dashboard?.wsl?.online)">{{ dashboard?.wsl?.online ? '在线' : '离线' }}</strong><small>{{ dashboard?.wsl?.frpcActive ? 'FRP 正常' : 'FRP 未确认' }}</small></article>
              <article class="metric"><span>证书</span><strong :class="statusClass((dashboard?.certificate?.daysRemaining ?? -1) > 14)">{{ dashboard?.certificate?.daysRemaining ?? '-' }} 天</strong><small>{{ formatDate(dashboard?.certificate?.expiresAt) }}</small></article>
            </div>

            <h2>站点检查</h2>
            <div class="table-wrap"><table><thead><tr><th>服务</th><th>状态</th><th>HTTP</th><th>延迟</th><th>地址</th></tr></thead><tbody>
              <tr v-for="service in dashboard?.services ?? []" :key="service.name"><td>{{ service.name }}</td><td><span class="dot" :class="statusClass(service.online)"></span>{{ service.online ? '在线' : '异常' }}</td><td>{{ service.status ?? '-' }}</td><td>{{ service.latencyMs }} ms</td><td><a :href="service.url" target="_blank" rel="noreferrer">{{ service.url }}</a></td></tr>
            </tbody></table></div>

            <h2>宿主机容器</h2>
            <div v-if="!dashboard?.docker?.available" class="empty">{{ dashboard?.docker?.message || 'Docker socket 不可用' }}</div>
            <div v-else class="cards"><article v-for="container in dashboard.docker.containers" :key="container.id" class="card"><div class="row"><strong>{{ container.name }}</strong><span class="pill" :class="statusClass(container.state === 'running')">{{ container.state }}</span></div><p>{{ container.image }}</p><small>{{ container.status }}</small><div class="container-actions"><button class="link" :disabled="busy || container.protected || container.name === 'wangshun-portfolio' || container.state === 'running'" @click="runDockerAction('aliyun', container, 'start')">启动</button><button class="link" :disabled="busy || container.protected || container.name === 'wangshun-portfolio' || container.state !== 'running'" @click="runDockerAction('aliyun', container, 'stop')">停止</button><button class="link" :disabled="busy || container.protected || container.name === 'wangshun-portfolio' || container.state !== 'running'" @click="runDockerAction('aliyun', container, 'restart')">重启</button><button class="link danger" :disabled="busy || container.protected || container.name === 'wangshun-portfolio' || container.state === 'running'" @click="runDockerAction('aliyun', container, 'delete')">删除</button></div></article></div>

            <h2>WSL 状态</h2>
            <div class="cards"><article class="card"><div class="row"><strong>{{ dashboard?.wsl?.hostname || 'WSL' }}</strong><span class="pill" :class="statusClass(dashboard?.wsl?.online)">{{ dashboard?.wsl?.online ? 'online' : 'offline' }}</span></div><p>最近心跳：{{ formatTime(dashboard?.wsl?.lastSeen) }}</p><small>FRP：{{ dashboard?.wsl?.frpcActive ? 'active' : 'unknown' }}</small></article><article v-for="proxy in dashboard?.wsl?.proxies ?? []" :key="proxy.name" class="card"><strong>{{ proxy.name }}</strong><p>{{ proxy.type }} · {{ proxy.localPort }} → {{ proxy.remotePort }}</p></article></div>
            <h2>WSL 容器</h2>
            <div v-if="!dashboard?.wsl?.containers?.length" class="empty">WSL 离线或暂无容器信息</div>
            <div v-else class="cards"><article v-for="container in dashboard.wsl.containers" :key="container.id" class="card"><div class="row"><strong>{{ container.name }}</strong><span class="pill" :class="statusClass(container.state === 'running')">{{ container.state }}</span></div><p>{{ container.image }}</p><small>{{ container.status }}</small><div class="container-actions"><button class="link" :disabled="busy || !dashboard?.wsl?.online || container.protected || container.state === 'running'" @click="runDockerAction('wsl', container, 'start')">启动</button><button class="link" :disabled="busy || !dashboard?.wsl?.online || container.protected || container.state !== 'running'" @click="runDockerAction('wsl', container, 'stop')">停止</button><button class="link" :disabled="busy || !dashboard?.wsl?.online || container.protected || container.state !== 'running'" @click="runDockerAction('wsl', container, 'restart')">重启</button><button class="link danger" :disabled="busy || !dashboard?.wsl?.online || container.protected || container.state === 'running'" @click="runDockerAction('wsl', container, 'delete')">删除</button></div></article></div>
          </section>

          <section v-if="tab === 'routes'">
            <div class="section-head"><div><p class="eyebrow">REVERSE PROXY</p><h1>域名绑定</h1></div></div>
            <div class="warning">请先在爱名网把子域名解析到服务器。HTTPS 默认关闭；需要 HTTPS 时，还要先把该域名加入证书。</div>
            <h2>当前 Nginx 绑定（只读）</h2>
            <div class="table-wrap"><table><thead><tr><th>域名</th><th>目标</th><th>HTTPS</th><th>来源</th></tr></thead><tbody>
              <tr v-for="route in staticRoutes" :key="route.domain"><td>{{ route.domain }}</td><td>{{ route.protocol }}://{{ route.targetHost }}:{{ route.targetPort }}</td><td>{{ route.tls ? '是' : '否' }}</td><td><span class="pill">Nginx 配置</span></td></tr>
              <tr v-if="!staticRoutes.length"><td colspan="4" class="empty">没有发现现有 Nginx 反向代理</td></tr>
            </tbody></table></div>
            <h2>后台管理的动态绑定</h2>
            <form class="form-grid card form-card" @submit.prevent="saveRoute">
              <label>子域名<input v-model.trim="routeForm.domain" placeholder="aaa.wangshun.work" required /></label>
              <label>目标主机<select v-model="routeForm.targetHost"><option value="host.docker.internal">宿主机</option><option value="127.0.0.1">网关容器自身</option><option value="agent-quest">Agent Quest 容器</option></select></label>
              <label>目标端口<input v-model.number="routeForm.targetPort" type="number" min="1024" max="65535" required /></label>
              <label>上游协议<select v-model="routeForm.protocol"><option value="http">HTTP</option><option value="https">HTTPS</option></select></label>
              <label>健康路径<input v-model.trim="routeForm.healthPath" placeholder="/" /></label>
              <label class="check"><input v-model="routeForm.enabled" type="checkbox" />启用路由</label>
              <label class="check"><input v-model="routeForm.tls" type="checkbox" />启用 HTTPS（证书已覆盖时）</label>
              <div class="form-actions"><button class="primary" :disabled="busy">{{ routeForm.id ? '保存修改' : '新增绑定' }}</button><button v-if="routeForm.id" type="button" class="ghost" @click="resetRoute">取消</button></div>
            </form>
            <div class="table-wrap"><table><thead><tr><th>域名</th><th>目标</th><th>HTTPS</th><th>状态</th><th>操作</th></tr></thead><tbody>
              <tr v-for="route in routes" :key="route.id"><td>{{ route.domain }}</td><td>{{ route.protocol }}://{{ route.targetHost }}:{{ route.targetPort }}</td><td>{{ route.tls ? '是' : '否' }}</td><td><span class="pill" :class="statusClass(route.applyState === 'applied' || route.applyState === 'staged')">{{ route.applyState }}</span><small class="block">{{ route.applyMessage }}</small></td><td><button class="link" @click="editRoute(route)">编辑</button><button class="link danger" @click="removeRoute(route)">删除</button></td></tr>
              <tr v-if="!routes.length"><td colspan="5" class="empty">还没有动态绑定</td></tr>
            </tbody></table></div>
          </section>

          <section v-if="tab === 'tunnels'">
            <div class="section-head"><div><p class="eyebrow">FRP / WSL</p><h1>内网穿透</h1></div><span class="pill" :class="statusClass(tunnelState.wsl.online)">{{ tunnelState.wsl.online ? 'WSL 在线' : 'WSL 离线' }}</span></div>
            <div v-if="!tunnelState.wsl.online" class="warning">最近没有收到 WSL 心跳。为避免写坏离线机器的配置，新增、修改和删除已锁定。</div>
            <h2>当前 FRP 穿透（只读）</h2>
            <div class="table-wrap"><table><thead><tr><th>名称</th><th>映射</th><th>协议</th><th>来源</th></tr></thead><tbody>
              <tr v-for="proxy in tunnelState.wsl.proxies" :key="proxy.name"><td>{{ proxy.name }}</td><td>127.0.0.1:{{ proxy.localPort }} → :{{ proxy.remotePort }}</td><td>{{ proxy.type }}</td><td><span class="pill">frpc.toml</span></td></tr>
              <tr v-if="!tunnelState.wsl.proxies.length"><td colspan="4" class="empty">尚未收到 WSL FRP 配置</td></tr>
            </tbody></table></div>
            <h2>后台管理的穿透配置</h2>
            <form class="form-grid card form-card" @submit.prevent="saveTunnel">
              <fieldset :disabled="!tunnelState.wsl.online || busy">
                <label>名称<input v-model.trim="tunnelForm.name" placeholder="my-service" required /></label>
                <label>WSL 本地端口<input v-model.number="tunnelForm.localPort" type="number" min="1024" max="65535" required /></label>
                <label>公网远程端口<input v-model.number="tunnelForm.remotePort" type="number" min="1024" max="65535" required /></label>
                <label>协议<select v-model="tunnelForm.protocol"><option value="tcp">TCP</option><option value="udp">UDP</option></select></label>
                <label class="check"><input v-model="tunnelForm.enabled" type="checkbox" />启用</label>
                <div class="form-actions"><button class="primary">{{ tunnelForm.id ? '保存修改' : '新增穿透' }}</button><button v-if="tunnelForm.id" type="button" class="ghost" @click="resetTunnel">取消</button></div>
              </fieldset>
            </form>
            <div class="table-wrap"><table><thead><tr><th>名称</th><th>映射</th><th>协议</th><th>同步</th><th>操作</th></tr></thead><tbody>
              <tr v-for="tunnel in tunnels" :key="tunnel.id"><td>{{ tunnel.name }}</td><td>127.0.0.1:{{ tunnel.localPort }} → :{{ tunnel.remotePort }}</td><td>{{ tunnel.protocol }}</td><td><span class="pill">{{ tunnel.syncState }}</span><small class="block">{{ tunnel.syncMessage }}</small></td><td><button class="link" :disabled="!tunnelState.wsl.online" @click="editTunnel(tunnel)">编辑</button><button class="link danger" :disabled="!tunnelState.wsl.online" @click="removeTunnel(tunnel)">删除</button></td></tr>
              <tr v-if="!tunnels.length"><td colspan="5" class="empty">还没有后台管理的穿透配置</td></tr>
            </tbody></table></div>
          </section>

          <section v-if="tab === 'traffic'">
            <div class="section-head"><div><p class="eyebrow">OBSERVABILITY</p><h1>流量与任务</h1></div></div>
            <h2>最近 24 小时流量</h2>
            <div v-if="!dashboard?.traffic?.available" class="empty">{{ dashboard?.traffic?.message || '暂无访问日志' }}</div>
            <div v-else class="table-wrap"><table><thead><tr><th>站点</th><th>请求</th><th>成功</th><th>4xx / 5xx</th><th>平均耗时</th><th>主要来源</th></tr></thead><tbody><tr v-for="host in dashboard.traffic.hosts" :key="host.host"><td>{{ host.host }}</td><td>{{ host.requests }}</td><td>{{ host.success }}</td><td>{{ host.clientErrors }} / {{ host.serverErrors }}</td><td>{{ host.averageRequestTime }} s</td><td>{{ host.referrers.map((item: any) => `${item.source} (${item.count})`).join('、') || '直接访问' }}</td></tr></tbody></table></div>
            <h2>脚本与任务记录</h2>
            <div class="table-wrap"><table><thead><tr><th>任务</th><th>状态</th><th>时间</th><th>信息</th></tr></thead><tbody><tr v-for="job in dashboard?.jobs ?? []" :key="job.id"><td>{{ job.name }}</td><td><span class="pill" :class="statusClass(job.status === 'success')">{{ job.status }}</span></td><td>{{ formatTime(job.occurredAt) }}</td><td>{{ job.message }}</td></tr><tr v-if="!dashboard?.jobs?.length"><td colspan="4" class="empty">暂无任务上报</td></tr></tbody></table></div>
          </section>

          <section v-if="tab === 'settings'">
            <div class="section-head"><div><p class="eyebrow">SECURITY</p><h1>账号设置</h1></div></div>
            <form class="card password-card" @submit.prevent="changePassword"><label>当前密码<input v-model="passwordForm.currentPassword" type="password" autocomplete="current-password" required /></label><label>新密码<input v-model="passwordForm.nextPassword" type="password" autocomplete="new-password" minlength="8" required /></label><label>确认新密码<input v-model="passwordForm.confirm" type="password" autocomplete="new-password" minlength="8" required /></label><button class="primary" :disabled="busy">修改密码</button></form>
            <h2>最近操作</h2><div class="table-wrap"><table><thead><tr><th>账号</th><th>操作</th><th>对象</th><th>IP</th><th>时间</th></tr></thead><tbody><tr v-for="item in dashboard?.audit ?? []" :key="item.id"><td>{{ item.username }}</td><td>{{ item.action }}</td><td>{{ item.target }}</td><td>{{ item.ip }}</td><td>{{ formatTime(item.createdAt) }}</td></tr></tbody></table></div>
          </section>
        </main>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

// Dashboard, Docker and agent payloads intentionally share one heterogeneous API shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>
const tabs = [{ key: 'overview', label: '运行概览' }, { key: 'routes', label: '域名绑定' }, { key: 'tunnels', label: '内网穿透' }, { key: 'traffic', label: '流量与任务' }, { key: 'settings', label: '账号设置' }]
const tab = ref('overview')
const authenticated = ref(false)
const user = ref<Json | null>(null)
const csrfToken = ref('')
const busy = ref(false)
const error = ref('')
const notice = ref('')
const dashboard = ref<Json | null>(null)
const routes = ref<Json[]>([])
const staticRoutes = ref<Json[]>([])
const tunnels = ref<Json[]>([])
const tunnelState = reactive({ wsl: { online: false, lastSeen: null as string | null, proxies: [] as Json[] } })
const loginForm = reactive({ username: 'admin', password: '' })
const routeForm = reactive({ id: 0, domain: '', targetHost: 'host.docker.internal', targetPort: 10000, protocol: 'http', healthPath: '/', tls: false, enabled: true })
const tunnelForm = reactive({ id: 0, name: '', localPort: 10000, remotePort: 10000, protocol: 'tcp', enabled: true })
const passwordForm = reactive({ currentPassword: '', nextPassword: '', confirm: '' })
const onlineServices = computed(() => dashboard.value?.services?.filter((item: Json) => item.online).length ?? 0)

async function api(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)
  if (options.body) headers.set('Content-Type', 'application/json')
  if (csrfToken.value && options.method && options.method !== 'GET') headers.set('X-Ops-CSRF', csrfToken.value)
  const response = await fetch(`/api/ops${path}`, { ...options, headers, credentials: 'same-origin' })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401) authenticated.value = false
    throw new Error(data.error || `请求失败 (${response.status})`)
  }
  return data
}

function beginAction() { busy.value = true; error.value = ''; notice.value = '' }
function finishError(value: unknown) { error.value = value instanceof Error ? value.message : String(value); busy.value = false }
function flash(message: string) { notice.value = message; window.setTimeout(() => { if (notice.value === message) notice.value = '' }, 4000) }

async function login() {
  beginAction()
  try { const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(loginForm) }); user.value = data.user; csrfToken.value = data.csrfToken; authenticated.value = true; loginForm.password = ''; await refreshAll() } catch (e) { finishError(e) } finally { busy.value = false }
}
async function logout() { try { await api('/auth/logout', { method: 'POST' }) } finally { authenticated.value = false; user.value = null; csrfToken.value = '' } }
async function restoreSession() { try { const data = await api('/auth/me'); user.value = data.user; csrfToken.value = data.csrfToken; authenticated.value = true; await refreshAll() } catch { authenticated.value = false } }
async function refreshAll() {
  error.value = ''
  try {
    const [dashboardData, routeData, tunnelData] = await Promise.all([api('/dashboard'), api('/routes'), api('/tunnels')])
    dashboard.value = dashboardData; routes.value = routeData.routes; staticRoutes.value = routeData.staticRoutes ?? []; tunnels.value = tunnelData.tunnels; Object.assign(tunnelState.wsl, tunnelData.wsl)
  } catch (e) { error.value = e instanceof Error ? e.message : String(e) }
}
async function runDockerAction(target: 'aliyun' | 'wsl', container: Json, action: 'start' | 'stop' | 'restart' | 'delete') {
  const labels = { start: '启动', stop: '停止', restart: '重启', delete: '删除' }
  const label = labels[action]
  if (action === 'delete') {
    if (prompt(`删除后无法恢复。请输入容器名 ${container.name} 确认：`) !== container.name) return
  } else if (!confirm(`确定要${label}${target === 'aliyun' ? '阿里云' : 'WSL'}容器 ${container.name} 吗？`)) return
  beginAction()
  try {
    await api('/docker/actions', { method: 'POST', body: JSON.stringify({ target, containerId: container.id, action, confirmName: action === 'delete' ? container.name : '' }) })
    if (target === 'wsl') {
      flash(`${label}任务已提交，Agent 将在下一轮心跳执行`)
      window.setTimeout(refreshAll, 32000)
    } else {
      await refreshAll()
      flash(`容器已${label}`)
    }
  } catch (e) { finishError(e) } finally { busy.value = false }
}
function resetRoute() { Object.assign(routeForm, { id: 0, domain: '', targetHost: 'host.docker.internal', targetPort: 10000, protocol: 'http', healthPath: '/', tls: false, enabled: true }) }
function editRoute(route: Json) { Object.assign(routeForm, route); window.scrollTo({ top: 0, behavior: 'smooth' }) }
async function saveRoute() { beginAction(); try { const id = routeForm.id; await api(id ? `/routes/${id}` : '/routes', { method: id ? 'PUT' : 'POST', body: JSON.stringify(routeForm) }); resetRoute(); await refreshAll(); flash(id ? '域名绑定已更新' : '域名绑定已新增') } catch (e) { finishError(e) } finally { busy.value = false } }
async function removeRoute(route: Json) { if (!confirm(`确定删除 ${route.domain} 的绑定吗？`)) return; beginAction(); try { await api(`/routes/${route.id}`, { method: 'DELETE' }); await refreshAll(); flash('域名绑定已删除') } catch (e) { finishError(e) } finally { busy.value = false } }
function resetTunnel() { Object.assign(tunnelForm, { id: 0, name: '', localPort: 10000, remotePort: 10000, protocol: 'tcp', enabled: true }) }
function editTunnel(tunnel: Json) { Object.assign(tunnelForm, tunnel); window.scrollTo({ top: 0, behavior: 'smooth' }) }
async function saveTunnel() { beginAction(); try { const id = tunnelForm.id; await api(id ? `/tunnels/${id}` : '/tunnels', { method: id ? 'PUT' : 'POST', body: JSON.stringify(tunnelForm) }); resetTunnel(); await refreshAll(); flash('穿透同步任务已提交') } catch (e) { finishError(e) } finally { busy.value = false } }
async function removeTunnel(tunnel: Json) { if (!confirm(`确定删除 ${tunnel.name} 吗？`)) return; beginAction(); try { await api(`/tunnels/${tunnel.id}`, { method: 'DELETE' }); await refreshAll(); flash('穿透删除任务已提交') } catch (e) { finishError(e) } finally { busy.value = false } }
async function changePassword() { if (passwordForm.nextPassword !== passwordForm.confirm) { error.value = '两次输入的新密码不一致'; return } beginAction(); try { await api('/auth/password', { method: 'POST', body: JSON.stringify(passwordForm) }); alert('密码已修改，请重新登录'); authenticated.value = false; csrfToken.value = ''; Object.assign(passwordForm, { currentPassword: '', nextPassword: '', confirm: '' }) } catch (e) { finishError(e) } finally { busy.value = false } }
function statusClass(ok: boolean | undefined) { return ok ? 'good' : 'bad' }
function formatTime(value?: string | null) { return value ? new Date(value).toLocaleString('zh-CN') : '暂无' }
function formatDate(value?: string | null) { return value ? new Date(value).toLocaleDateString('zh-CN') : '未获取' }
onMounted(restoreSession)
</script>

<style scoped>
.ops-shell{min-height:100vh;background:#f5f6f8;color:#18212f;font-family:Inter,"PingFang SC",sans-serif}.login-wrap{min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 20% 20%,#e6f0ff 0,transparent 32%),radial-gradient(circle at 80% 80%,#edf8f2 0,transparent 28%)}.login-card{width:min(420px,100%);padding:36px;background:#fff;border:1px solid #e3e7ed;border-radius:18px;box-shadow:0 18px 50px rgba(27,39,60,.09)}h1{font:600 28px/1.2 Inter,"PingFang SC",sans-serif;margin:5px 0 8px}h2{font:600 18px/1.2 Inter,"PingFang SC",sans-serif;margin:32px 0 14px}.eyebrow{font-size:11px;font-weight:700;letter-spacing:.16em;color:#5271ff}.muted{color:#788394}.login-card .muted{margin-bottom:28px}.login-card label,.password-card label,.form-grid label{display:grid;gap:7px;font-size:13px;font-weight:600;margin:14px 0}input,select{width:100%;border:1px solid #d9dee7;border-radius:8px;background:#fff;padding:10px 12px;font:inherit;color:inherit;outline:none}input:focus,select:focus{border-color:#5271ff;box-shadow:0 0 0 3px rgba(82,113,255,.1)}button{font:inherit;cursor:pointer}.primary{border:0;border-radius:8px;padding:10px 16px;background:#3155e7;color:#fff;font-weight:600}.primary:disabled,button:disabled{opacity:.45;cursor:not-allowed}.login-card .primary{width:100%;margin-top:12px}.back{display:block;text-align:center;color:#788394;margin-top:20px;text-decoration:none;font-size:13px}.topbar{height:62px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:#fff;border-bottom:1px solid #e4e7ec;position:sticky;top:0;z-index:5}.brand{font-weight:750}.top-actions{display:flex;gap:8px}.ghost{border:1px solid #dce1e9;border-radius:7px;padding:7px 12px;background:#fff;color:#465266}.layout{display:grid;grid-template-columns:190px minmax(0,1fr);min-height:calc(100vh - 62px)}.nav{padding:22px 12px;background:#fff;border-right:1px solid #e4e7ec}.nav button{width:100%;border:0;border-radius:8px;padding:10px 12px;margin:2px 0;text-align:left;background:transparent;color:#647083}.nav button.active{background:#eef2ff;color:#3155e7;font-weight:650}.content{width:min(1260px,100%);padding:30px 34px 60px}.content section{padding:0}.section-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:22px}.section-head small{color:#8a94a3}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.metric,.card{background:#fff;border:1px solid #e4e7ec;border-radius:11px;padding:17px;box-shadow:0 1px 2px rgba(22,34,51,.03)}.metric{display:grid;gap:6px}.metric span,.metric small,.card p,.card small{color:#788394}.metric strong{font-size:24px}.good{color:#16865b!important}.bad{color:#d04a4a!important}.dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:currentColor;margin-right:7px}.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}.row{display:flex;align-items:center;justify-content:space-between;gap:10px}.card p{margin:8px 0;font-size:13px;word-break:break-all}.pill{display:inline-block;border-radius:999px;padding:3px 8px;background:#edf0f5;color:#677384;font-size:11px}.pill.good{background:#e9f7f0}.pill.bad{background:#fceeed}.table-wrap{overflow:auto;background:#fff;border:1px solid #e4e7ec;border-radius:10px}table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:12px 14px;border-bottom:1px solid #eef0f3;text-align:left;vertical-align:top}th{background:#fafbfc;color:#667284;font-weight:650;white-space:nowrap}td a{color:#3155e7;text-decoration:none}.empty{text-align:center;padding:24px;color:#8b95a3}.message,.warning{border-radius:8px;padding:10px 13px;margin:0 0 16px;font-size:13px}.message.error{background:#fff0ef;color:#b73535}.message.ok{background:#eaf8f1;color:#15744f}.warning{background:#fff8e4;border:1px solid #f2dfa4;color:#735b14}.form-card{margin-bottom:18px}.form-grid{padding:18px}.form-grid>label{margin:0}.form-grid,.form-grid fieldset{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.form-grid fieldset{border:0;grid-column:1/-1}.check{display:flex!important;align-items:center;gap:8px!important;align-self:end;min-height:40px}.check input{width:auto}.form-actions{grid-column:1/-1;display:flex;gap:8px;margin-top:4px}.link{border:0;background:transparent;color:#3155e7;padding:3px 6px}.link.danger{color:#c94343}.block{display:block;color:#8791a0;margin-top:5px;max-width:360px}.password-card{width:min(500px,100%);padding:20px}.password-card button{margin-top:14px}
.container-actions{display:flex;flex-wrap:wrap;gap:4px;margin-top:12px;padding-top:10px;border-top:1px solid #eef0f3}
@media(max-width:850px){.layout{grid-template-columns:1fr}.nav{display:flex;overflow:auto;border-right:0;border-bottom:1px solid #e4e7ec;padding:8px;position:sticky;top:62px;z-index:4}.nav button{width:auto;white-space:nowrap}.content{padding:22px 15px 48px}.metrics{grid-template-columns:repeat(2,1fr)}.form-grid,.form-grid fieldset{grid-template-columns:1fr 1fr}.topbar{padding:0 15px}}@media(max-width:540px){.metrics{grid-template-columns:1fr}.form-grid,.form-grid fieldset{grid-template-columns:1fr}.topbar .muted{display:none}.section-head{align-items:start;gap:10px;flex-direction:column}th,td{padding:10px}.login-card{padding:26px 22px}}
</style>
