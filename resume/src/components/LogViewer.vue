<template>
  <div class="log-viewer">
    <header class="log-header">
      <div>
        <a href="/" class="back-link">返回简历</a>
        <h2>访问统计</h2>
        <p>基于 Nginx access log 的实时访问分析，默认过滤静态资源并脱敏 IP。</p>
      </div>
      <div class="header-actions">
        <div v-if="lastUpdated" class="last-updated">更新于 {{ lastUpdated }}</div>
        <button @click="refreshLogs" :disabled="loading" class="btn btn-primary small-btn">
          <RefreshCw class="w-4 h-4" :class="{ spinning: loading }" />
          <span>{{ loading ? '加载中' : '刷新' }}</span>
        </button>
      </div>
    </header>

    <section v-if="authRequired && !hasToken" class="auth-panel card">
      <Lock class="w-5 h-5 text-[var(--color-accent)]" />
      <div class="auth-content">
        <h3>需要访问令牌</h3>
        <p>服务端已配置 `LOG_ADMIN_TOKEN`，请输入令牌后查看日志统计。</p>
        <div class="auth-form">
          <input v-model="tokenInput" type="password" placeholder="LOG_ADMIN_TOKEN" @keyup.enter="saveToken" />
          <button class="btn btn-primary small-btn" @click="saveToken">确认</button>
        </div>
      </div>
    </section>

    <template v-else>
      <section class="toolbar card">
        <div class="control">
          <label>时间范围</label>
          <select v-model="filters.range">
            <option value="24">近 24 小时</option>
            <option value="72">近 3 天</option>
            <option value="168">近 7 天</option>
            <option value="all">全部</option>
          </select>
        </div>
        <div class="control">
          <label>状态码</label>
          <select v-model="filters.status">
            <option value="all">全部</option>
            <option value="200">2xx 成功</option>
            <option value="300">3xx 跳转</option>
            <option value="400">4xx 客户端错误</option>
            <option value="500">5xx 服务端错误</option>
          </select>
        </div>
        <div class="control">
          <label>设备</label>
          <select v-model="filters.device">
            <option value="all">全部</option>
            <option value="desktop">桌面端</option>
            <option value="mobile">手机</option>
            <option value="tablet">平板</option>
            <option value="bot">Bot</option>
          </select>
        </div>
        <div class="control grow">
          <label>搜索</label>
          <div class="search-box">
            <Search class="w-4 h-4" />
            <input v-model="filters.q" placeholder="路径、地区、浏览器、状态码" />
          </div>
        </div>
        <label class="check-control">
          <input type="checkbox" v-model="filters.hideBots" />
          隐藏 Bot
        </label>
        <div class="control compact">
          <label>自动刷新</label>
          <select v-model.number="autoRefreshSeconds">
            <option :value="0">关闭</option>
            <option :value="5">5 秒</option>
            <option :value="15">15 秒</option>
            <option :value="60">60 秒</option>
          </select>
        </div>
      </section>

      <div v-if="errorMessage" class="error-banner">
        <AlertTriangle class="w-4 h-4" />
        <span>{{ errorMessage }}</span>
      </div>

      <section class="kpi-grid" v-if="stats">
        <div v-for="item in kpis" :key="item.label" class="kpi-card card">
          <div class="kpi-icon" :class="item.tone">
            <component :is="item.icon" class="w-5 h-5" />
          </div>
          <div>
            <div class="kpi-value">{{ item.value }}</div>
            <div class="kpi-label">{{ item.label }}</div>
          </div>
        </div>
      </section>

      <section class="dashboard-grid" v-if="stats">
        <div class="panel card trend-panel">
          <div class="panel-title">
            <Activity class="w-4 h-4" />
            <span>近 24 小时趋势</span>
          </div>
          <div class="trend-chart">
            <svg viewBox="0 0 100 42" preserveAspectRatio="none">
              <polyline class="trend-line" :points="trendPoints" />
              <polyline class="error-line" :points="errorTrendPoints" />
            </svg>
            <div class="trend-axis">
              <span>{{ firstTrendLabel }}</span>
              <span>{{ lastTrendLabel }}</span>
            </div>
          </div>
          <div class="legend">
            <span><i class="dot primary"></i>访问</span>
            <span><i class="dot danger"></i>错误</span>
          </div>
        </div>

        <div class="panel card">
          <div class="panel-title">
            <Gauge class="w-4 h-4" />
            <span>入口访问量</span>
          </div>
          <div class="bar-list">
            <div v-for="item in serviceDistribution" :key="item.label" class="bar-row">
              <span>{{ item.label }}</span>
              <div class="bar-track">
                <div class="bar-fill neutral" :style="{ width: `${item.percent}%` }"></div>
              </div>
              <strong>{{ item.count }}</strong>
            </div>
          </div>
        </div>

        <div class="panel card">
          <div class="panel-title">
            <MonitorSmartphone class="w-4 h-4" />
            <span>设备分布</span>
          </div>
          <div class="bar-list">
            <div v-for="item in deviceDistribution" :key="item.label" class="bar-row">
              <span>{{ item.label }}</span>
              <div class="bar-track">
                <div class="bar-fill neutral" :style="{ width: `${item.percent}%` }"></div>
              </div>
              <strong>{{ item.count }}</strong>
            </div>
          </div>
        </div>

        <div class="panel card">
          <div class="panel-title">
            <MapPinned class="w-4 h-4" />
            <span>访问地区</span>
          </div>
          <div class="rank-list">
            <div v-for="item in stats.topCountries" :key="item.country" class="rank-row">
              <span>{{ item.country }}</span>
              <strong>{{ item.count }}</strong>
            </div>
            <div v-if="!stats.topCountries.length" class="empty-mini">暂无地理位置数据</div>
          </div>
        </div>

        <div class="panel card">
          <div class="panel-title">
            <Route class="w-4 h-4" />
            <span>入口路径访问</span>
          </div>
          <div class="rank-list path-rank">
            <div v-for="item in stats.topPaths" :key="`${item.port}-${item.path}`" class="rank-row path-row">
              <span :title="`${item.service} :${item.port}${item.path}`">
                <b>{{ item.service }}</b>
                <em>:{{ item.port }}</em>
                {{ item.path }}
              </span>
              <strong>{{ item.count }}</strong>
            </div>
          </div>
        </div>

        <div class="panel card">
          <div class="panel-title">
            <Globe2 class="w-4 h-4" />
            <span>浏览器 / 系统</span>
          </div>
          <div class="split-rank">
            <div>
              <div class="sub-title">浏览器</div>
              <div v-for="item in stats.topBrowsers" :key="item.browser" class="rank-row compact-row">
                <span>{{ item.browser }}</span>
                <strong>{{ item.count }}</strong>
              </div>
            </div>
            <div>
              <div class="sub-title">系统</div>
              <div v-for="item in stats.topOs" :key="item.os" class="rank-row compact-row">
                <span>{{ item.os }}</span>
                <strong>{{ item.count }}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="table-panel card">
        <div class="table-header">
          <div>
            <h3>最近访问</h3>
            <p>展示 {{ logs.length }} 条，符合筛选条件共 {{ stats?.total || 0 }} 条</p>
          </div>
          <button v-if="canLoadMore" class="btn btn-outline small-btn" @click="loadMore">加载更多</button>
        </div>

        <div class="log-table-container">
          <table class="log-table">
            <thead>
              <tr>
                <th>入口</th>
                <th>IP / 地区</th>
                <th>设备</th>
                <th>路径</th>
                <th>状态</th>
                <th>耗时</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, index) in logs" :key="`${log.time}-${index}`">
                <td>
                  <span class="service-chip">{{ log.serviceLabel || serviceLabelByPort(log.port) }} :{{ log.port || '80' }}</span>
                </td>
                <td>
                  <div class="ip-info">
                    <span class="ip">{{ log.ip }}</span>
                    <span class="muted">{{ formatGeo(log.geo) }}</span>
                  </div>
                </td>
                <td>
                  <div class="device-info">
                    <span class="device-chip">{{ deviceLabel(log.device?.type) }}</span>
                    <span class="muted">{{ log.device?.browser || '-' }} / {{ log.device?.os || '-' }}</span>
                  </div>
                </td>
                <td class="path-cell" :title="log.path">
                  <span class="method">{{ log.method }}</span>
                  <span class="path-text">{{ log.path }}</span>
                </td>
                <td>
                  <span class="status" :class="getStatusClass(log.status)">{{ log.status }}</span>
                </td>
                <td class="muted nowrap">{{ log.requestTimeMs || 0 }} ms</td>
                <td class="muted nowrap">{{ log.time }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="logs.length === 0 && !loading" class="empty">
            暂无匹配的访问记录
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock3,
  Gauge,
  Globe2,
  Lock,
  MapPinned,
  MonitorSmartphone,
  RefreshCw,
  Route,
  Search,
  ShieldAlert,
  Users,
} from 'lucide-vue-next'

interface GeoInfo {
  country: string
  region: string
  city: string
}

interface DeviceInfo {
  type: string
  os: string
  browser: string
  device: string
  bot?: boolean
}

interface LogEntry {
  ip: string
  geo: GeoInfo | null
  device: DeviceInfo | null
  method: string
  path: string
  pagePath?: string
  port?: string
  serviceLabel?: string
  service?: {
    key: string
    port: string
    label: string
  }
  status: number
  statusGroup: number
  requestTimeMs: number
  time: string
}

interface TrendPoint {
  label: string
  count: number
  errors: number
}

interface Stats {
  total: number
  totalAll: number
  today: number
  uniqueIps: number
  successRequests: number
  redirectRequests: number
  errorRequests: number
  avgRequestTimeMs: number
  statusGroups: Record<string, number>
  devices: Record<string, number>
  topIps: { ip: string; count: number }[]
  serviceVisits: { key: string; port: string; label: string; count: number }[]
  topPaths: { service: string; port: string; path: string; count: number }[]
  topCountries: { country: string; count: number }[]
  topBrowsers: { browser: string; count: number }[]
  topOs: { os: string; count: number }[]
  hourlyTrend: TrendPoint[]
}

const logs = ref<LogEntry[]>([])
const stats = ref<Stats | null>(null)
const loading = ref(false)
const errorMessage = ref('')
const lastUpdated = ref('')
const limit = ref(100)
const autoRefreshSeconds = ref(0)
const authRequired = ref(false)
const tokenInput = ref(localStorage.getItem('log-admin-token') || '')
const hasToken = computed(() => !authRequired.value || Boolean(tokenInput.value))
let refreshInterval: ReturnType<typeof setInterval> | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const filters = reactive({
  range: '24',
  status: 'all',
  device: 'all',
  q: '',
  hideBots: true,
})

const kpis = computed(() => {
  if (!stats.value) return []
  return [
    { label: '访问量', value: stats.value.total, icon: BarChart3, tone: 'accent' },
    { label: '今日访问', value: stats.value.today, icon: Activity, tone: 'green' },
    { label: '独立访客', value: stats.value.uniqueIps, icon: Users, tone: 'brown' },
    { label: '成功请求', value: stats.value.successRequests, icon: Gauge, tone: 'green' },
    { label: '异常请求', value: stats.value.errorRequests, icon: ShieldAlert, tone: 'danger' },
    { label: '平均耗时', value: `${stats.value.avgRequestTimeMs || 0} ms`, icon: Clock3, tone: 'brown' },
  ]
})

const statusDistribution = computed(() => {
  const groups = stats.value?.statusGroups || {}
  const total = Math.max(stats.value?.total || 0, 1)
  return [
    { label: '2xx', count: groups[200] || 0, tone: 'ok' },
    { label: '3xx', count: groups[300] || 0, tone: 'warn' },
    { label: '4xx', count: groups[400] || 0, tone: 'bad' },
    { label: '5xx', count: groups[500] || 0, tone: 'bad' },
  ].map(item => ({ ...item, percent: Math.round((item.count / total) * 100) }))
})

const serviceDistribution = computed(() => {
  const services = stats.value?.serviceVisits || []
  const total = Math.max(services.reduce((sum, item) => sum + item.count, 0), 1)
  return services.map(item => ({
    label: `${item.label} :${item.port}`,
    count: item.count,
    percent: Math.round((item.count / total) * 100),
  }))
})

const deviceDistribution = computed(() => {
  const devices = stats.value?.devices || {}
  const total = Math.max(stats.value?.total || 0, 1)
  return ['desktop', 'mobile', 'tablet', 'bot', 'unknown']
    .map(key => ({ label: deviceLabel(key), count: devices[key] || 0, percent: Math.round(((devices[key] || 0) / total) * 100) }))
    .filter(item => item.count > 0)
})

const maxTrendCount = computed(() => Math.max(...(stats.value?.hourlyTrend || []).map(item => item.count), 1))
const trendPoints = computed(() => buildTrendPoints('count'))
const errorTrendPoints = computed(() => buildTrendPoints('errors'))
const firstTrendLabel = computed(() => stats.value?.hourlyTrend?.[0]?.label || '')
const lastTrendLabel = computed(() => {
  const trend = stats.value?.hourlyTrend || []
  return trend.length ? trend[trend.length - 1].label : ''
})
const canLoadMore = computed(() => Boolean(stats.value && logs.value.length < stats.value.total))

function buildTrendPoints(field: 'count' | 'errors') {
  const points = stats.value?.hourlyTrend || []
  if (!points.length) return ''
  return points
    .map((item, index) => {
      const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100
      const y = 38 - ((item[field] || 0) / maxTrendCount.value) * 32
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

async function fetchLogs() {
  loading.value = true
  errorMessage.value = ''

  const params = new URLSearchParams({
    range: filters.range,
    status: filters.status,
    device: filters.device,
    q: filters.q,
    hideBots: String(filters.hideBots),
    limit: String(limit.value),
  })

  try {
    const headers: Record<string, string> = {}
    if (tokenInput.value) {
      headers.Authorization = `Bearer ${tokenInput.value}`
    }

    const res = await fetch(`/api/logs?${params.toString()}`, { headers })

    if (res.status === 401) {
      authRequired.value = true
      errorMessage.value = '访问令牌无效或缺失。'
      return
    }

    const data = await res.json()
    logs.value = data.logs || []
    stats.value = data.stats || null
    authRequired.value = Boolean(data.meta?.authRequired)
    lastUpdated.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  } catch (e) {
    errorMessage.value = '获取日志失败，请检查日志服务和 Nginx 代理配置。'
    console.error('获取日志失败:', e)
  } finally {
    loading.value = false
  }
}

function refreshLogs() {
  fetchLogs()
}

function loadMore() {
  limit.value = Math.min(limit.value + 100, 500)
  fetchLogs()
}

function saveToken() {
  localStorage.setItem('log-admin-token', tokenInput.value)
  fetchLogs()
}

function scheduleFetch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    limit.value = 100
    fetchLogs()
  }, 250)
}

function resetInterval() {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
  if (autoRefreshSeconds.value > 0) {
    refreshInterval = setInterval(fetchLogs, autoRefreshSeconds.value * 1000)
  }
}

function getStatusClass(status: number): string {
  if (status >= 200 && status < 300) return 'success'
  if (status >= 300 && status < 400) return 'redirect'
  if (status >= 400 && status < 500) return 'client-error'
  if (status >= 500) return 'server-error'
  return ''
}

function formatGeo(geo: GeoInfo | null): string {
  if (!geo) return '-'
  const parts = [geo.city, geo.region, geo.country].filter(part => part && part !== '-')
  return [...new Set(parts)].join(', ') || '-'
}

function deviceLabel(type?: string): string {
  const labels: Record<string, string> = {
    desktop: '桌面端',
    mobile: '手机',
    tablet: '平板',
    tv: 'TV',
    wearable: '穿戴',
    bot: 'Bot',
    unknown: '未知',
  }
  return labels[type || 'unknown'] || '未知'
}

function serviceLabelByPort(port?: string): string {
  const labels: Record<string, string> = {
    '80': '首页',
    '3000': 'RPC',
    '8888': 'Code',
  }
  return labels[port || '80'] || '未知'
}

watch(filters, scheduleFetch, { deep: true })
watch(autoRefreshSeconds, resetInterval)

onMounted(() => {
  fetchLogs()
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style scoped>
.log-viewer {
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px;
  color: var(--color-text);
}

.log-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 24px;
}

.back-link {
  display: inline-flex;
  margin-bottom: 12px;
  color: var(--color-accent);
  font-size: 0.9rem;
  text-decoration: none;
}

.log-header h2 {
  font-size: clamp(2.2rem, 5vw, 4.2rem);
  color: var(--color-text);
}

.log-header p {
  max-width: 680px;
  color: var(--color-text-secondary);
  margin-top: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.last-updated {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.small-btn {
  min-height: 38px;
  padding: 0.55rem 0.9rem;
  font-size: 0.9rem;
}

.spinning {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-panel {
  display: flex;
  gap: 16px;
  padding: 20px;
  align-items: flex-start;
}

.auth-content h3 {
  font-family: var(--font-sans);
  font-weight: 700;
  margin-bottom: 4px;
}

.auth-content p {
  color: var(--color-text-secondary);
  font-size: 0.92rem;
  margin-bottom: 12px;
}

.auth-form {
  display: flex;
  gap: 10px;
}

.auth-form input,
.search-box input,
.control select {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: #fff;
  color: var(--color-text);
  min-height: 40px;
  padding: 0 12px;
  outline: none;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: flex-end;
  padding: 16px;
  margin-bottom: 20px;
}

.control {
  min-width: 148px;
}

.control.grow {
  flex: 1 1 260px;
}

.control.compact {
  min-width: 120px;
}

.control label {
  display: block;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  margin-bottom: 6px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: #fff;
  padding: 0 10px;
}

.search-box input {
  border: 0;
  padding: 0;
}

.check-control {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff4ef;
  border: 1px solid #f0d0c5;
  color: var(--color-accent-hover);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon.accent { background: var(--color-accent-light); color: var(--color-accent); }
.kpi-icon.green { background: rgba(107, 142, 107, 0.12); color: var(--color-tertiary); }
.kpi-icon.brown { background: rgba(139, 115, 85, 0.12); color: var(--color-secondary); }
.kpi-icon.danger { background: #fff1f1; color: #bf4b4b; }

.kpi-value {
  color: var(--color-text);
  font-size: 1.45rem;
  font-weight: 800;
  line-height: 1.1;
}

.kpi-label {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  margin-top: 4px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.panel {
  padding: 18px;
  min-height: 230px;
}

.trend-panel {
  grid-row: span 2;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text);
  font-weight: 800;
  margin-bottom: 16px;
}

.trend-chart {
  height: 170px;
  border-radius: 14px;
  background: linear-gradient(180deg, var(--color-bg-alt), #fff);
  border: 1px solid var(--color-border-light);
  padding: 14px;
}

.trend-chart svg {
  width: 100%;
  height: 128px;
  overflow: visible;
}

.trend-line,
.error-line {
  fill: none;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.trend-line {
  stroke: var(--color-accent);
}

.error-line {
  stroke: #bf4b4b;
}

.trend-axis,
.legend {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.legend {
  justify-content: flex-start;
  gap: 18px;
  margin-top: 12px;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  margin-right: 6px;
}

.dot.primary { background: var(--color-accent); }
.dot.danger { background: #bf4b4b; }

.bar-list {
  display: grid;
  gap: 12px;
}

.bar-row {
  display: grid;
  grid-template-columns: 72px 1fr 44px;
  align-items: center;
  gap: 10px;
  color: var(--color-text-secondary);
  font-size: 0.86rem;
}

.bar-row strong {
  text-align: right;
  color: var(--color-text);
}

.bar-track {
  height: 9px;
  border-radius: 999px;
  background: var(--color-bg-alt);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  min-width: 3px;
  border-radius: inherit;
}

.bar-fill.ok { background: var(--color-tertiary); }
.bar-fill.warn { background: #d0a24a; }
.bar-fill.bad { background: #bf4b4b; }
.bar-fill.neutral { background: var(--color-accent); }

.rank-list {
  display: grid;
  gap: 9px;
}

.rank-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 0.88rem;
}

.rank-row span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-row strong {
  color: var(--color-text);
}

.path-row b {
  color: var(--color-text);
  font-weight: 800;
}

.path-row em {
  margin: 0 0.35rem;
  color: var(--color-accent);
  font-style: normal;
  font-weight: 800;
}

.path-rank .rank-row {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.split-rank {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.sub-title {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  margin-bottom: 8px;
}

.compact-row {
  font-size: 0.82rem;
  margin-bottom: 8px;
}

.empty-mini {
  color: var(--color-text-muted);
  font-size: 0.86rem;
}

.table-panel {
  padding: 18px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.table-header h3 {
  font-family: var(--font-sans);
  font-size: 1.05rem;
  font-weight: 800;
}

.table-header p {
  color: var(--color-text-muted);
  font-size: 0.82rem;
  margin-top: 3px;
}

.log-table-container {
  overflow-x: auto;
  border: 1px solid var(--color-border-light);
  border-radius: 14px;
}

.log-table {
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
  font-size: 0.84rem;
}

.log-table th {
  background: var(--color-bg-alt);
  color: var(--color-text-secondary);
  padding: 12px;
  text-align: left;
  white-space: nowrap;
  font-weight: 800;
}

.log-table td {
  padding: 12px;
  border-top: 1px solid var(--color-border-light);
  color: var(--color-text-secondary);
}

.log-table tr:hover {
  background: #fffaf7;
}

.ip-info,
.device-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ip {
  color: var(--color-text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.muted {
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.nowrap {
  white-space: nowrap;
}

.device-chip,
.service-chip,
.method,
.status {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
}

.device-chip {
  background: var(--color-bg-alt);
  color: var(--color-secondary);
  padding: 2px 8px;
}

.service-chip {
  background: var(--color-accent-light);
  color: var(--color-accent);
  padding: 3px 9px;
  white-space: nowrap;
}

.path-cell {
  max-width: 360px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.method {
  flex-shrink: 0;
  padding: 2px 8px;
  background: var(--color-accent-light);
  color: var(--color-accent);
}

.path-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.status {
  padding: 2px 9px;
}

.status.success { background: rgba(107, 142, 107, 0.14); color: var(--color-tertiary); }
.status.redirect { background: #fff7e6; color: #a97615; }
.status.client-error,
.status.server-error { background: #fff1f1; color: #bf4b4b; }

.empty {
  text-align: center;
  padding: 42px;
  color: var(--color-text-muted);
}

@media (max-width: 1180px) {
  .kpi-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }

  .trend-panel {
    grid-column: 1 / -1;
    grid-row: auto;
  }
}

@media (max-width: 760px) {
  .log-viewer {
    padding: 20px;
  }

  .log-header,
  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    justify-content: flex-start;
  }

  .kpi-grid,
  .dashboard-grid,
  .split-rank {
    grid-template-columns: 1fr;
  }

  .toolbar {
    align-items: stretch;
  }

  .control,
  .control.compact {
    width: 100%;
  }
}
</style>
