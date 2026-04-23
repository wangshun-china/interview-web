const http = require('http');
const fs = require('fs');
const url = require('url');
const maxmind = require('maxmind');
const UAParser = require('ua-parser-js');

const PORT = Number(process.env.PORT || 3000);
const LOG_FILE = process.env.LOG_FILE || '/var/log/nginx/access.log';
const LOG_FILES = process.env.LOG_FILES || '';
const GEOLITE_DB = process.env.GEOLITE_DB || '/app/GeoLite2-City.mmdb';
const MAX_LOG_LINES = Number(process.env.MAX_LOG_LINES || 12000);
const ADMIN_TOKEN = process.env.LOG_ADMIN_TOKEN || '';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const FILTER_SCANS = process.env.FILTER_SCANS !== 'false';
const DEFAULT_SERVICE_PORT = process.env.DEFAULT_SERVICE_PORT || '80';

let geoipReader = null;
const uaParser = new UAParser();

const SERVICE_PORTS = {
  '80': { label: '首页', key: 'home' },
  '3000': { label: 'RPC', key: 'rpc' },
  '8888': { label: 'Code', key: 'code' }
};

function parseLogSources() {
  if (!LOG_FILES.trim()) {
    return [{ port: DEFAULT_SERVICE_PORT, path: LOG_FILE }];
  }

  return LOG_FILES
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      const separator = item.indexOf(':');
      if (separator === -1) {
        return { port: DEFAULT_SERVICE_PORT, path: item };
      }
      return {
        port: item.slice(0, separator).trim() || DEFAULT_SERVICE_PORT,
        path: item.slice(separator + 1).trim()
      };
    })
    .filter(item => item.path);
}

const LOG_SOURCES = parseLogSources();

const STATIC_EXTENSIONS = [
  '.css', '.js', '.mjs', '.ts', '.map',
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.avif',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.mp4', '.webm', '.mp3', '.wav', '.ogg'
];

const BOT_PATTERNS = [
  /bot/i, /spider/i, /crawler/i, /slurp/i, /bingpreview/i,
  /headless/i, /monitor/i, /uptime/i, /curl/i, /wget/i
];

const SUSPICIOUS_PATH_PATTERNS = [
  /^\/robots\.txt$/i,
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/\.well-known\/security\.txt$/i,
  /^\/sdk\/weblanguage/i,
  /^\/anthropic\/v1\/models/i,
  /^\/geoserver/i,
  /^\/webui/i,
  /^\/wp-/i,
  /^\/wordpress/i,
  /^\/phpmyadmin/i,
  /^\/admin/i,
  /^\/boaform/i,
  /^\/cgi-bin/i,
  /^\/manager\/html/i
];

function isStaticResource(requestPath) {
  const lowerPath = requestPath.toLowerCase().split('?')[0];
  return STATIC_EXTENSIONS.some(ext => lowerPath.endsWith(ext));
}

function parseNginxTime(nginxTime) {
  if (!nginxTime || nginxTime === '-') {
    return { label: '-', timestamp: 0 };
  }

  const normalized = nginxTime.replace(
    /(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2})/,
    '$2 $1, $3 $4:$5:$6'
  );
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return { label: nginxTime, timestamp: 0 };
  }

  const bjTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const year = bjTime.getUTCFullYear();
  const month = String(bjTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(bjTime.getUTCDate()).padStart(2, '0');
  const hour = String(bjTime.getUTCHours()).padStart(2, '0');
  const minute = String(bjTime.getUTCMinutes()).padStart(2, '0');
  const second = String(bjTime.getUTCSeconds()).padStart(2, '0');

  return {
    label: `${year}-${month}-${day} ${hour}:${minute}:${second}`,
    timestamp: date.getTime()
  };
}

async function initGeoIP() {
  try {
    if (fs.existsSync(GEOLITE_DB)) {
      geoipReader = await maxmind.open(GEOLITE_DB);
      console.log(`GeoIP database loaded: ${GEOLITE_DB}`);
    } else {
      console.warn(`GeoIP database not found: ${GEOLITE_DB}, geo lookup disabled`);
    }
  } catch (err) {
    console.error('Failed to load GeoIP database:', err.message);
  }
}

function lookupGeo(ip) {
  if (!geoipReader || !ip || ip === '-') {
    return null;
  }

  if (ip.startsWith('127.') || ip.startsWith('10.') || ip.startsWith('192.168.') || ip.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)) {
    return { country: '本地网络', region: '-', city: '-' };
  }

  try {
    const result = geoipReader.get(ip);
    if (!result) return null;

    return {
      country: result.country?.names?.zh || result.country?.names?.en || '-',
      region: result.subdivisions?.[0]?.names?.zh || result.subdivisions?.[0]?.names?.en || '-',
      city: result.city?.names?.zh || result.city?.names?.en || '-',
      latitude: result.location?.latitude || null,
      longitude: result.location?.longitude || null
    };
  } catch {
    return null;
  }
}

function parseUserAgent(ua) {
  if (!ua || ua === '-') {
    return { type: 'unknown', os: '-', browser: '-', device: '-', bot: false };
  }

  uaParser.setUA(ua);
  const result = uaParser.getResult();
  const bot = BOT_PATTERNS.some(pattern => pattern.test(ua));

  let deviceType = 'desktop';
  if (bot) {
    deviceType = 'bot';
  } else if (result.device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (result.device.type === 'tablet') {
    deviceType = 'tablet';
  } else if (result.device.type === 'smarttv' || result.device.type === 'tv') {
    deviceType = 'tv';
  } else if (result.device.type === 'wearable') {
    deviceType = 'wearable';
  }

  const browserName = result.browser.name || '-';
  const browserVersion = result.browser.version ? `${result.browser.name} ${result.browser.major || result.browser.version.split('.')[0]}` : browserName;
  const osName = result.os.name || '-';
  const osVersion = result.os.version ? `${result.os.name} ${result.os.version}` : osName;

  return {
    type: deviceType,
    os: osVersion,
    browser: bot ? 'Bot / Crawler' : browserVersion,
    device: result.device.model || result.device.vendor || '-',
    bot
  };
}

function maskIp(ip) {
  if (!ip || ip === '-') return '-';
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return `${parts.slice(0, 3).join(':')}:****`;
  }
  const parts = ip.split('.');
  if (parts.length !== 4) return ip;
  return `${parts[0]}.${parts[1]}.${parts[2]}.*`;
}

function normalizeEntry(line, sourcePort = DEFAULT_SERVICE_PORT) {
  if (line.startsWith('{')) {
    return { ...JSON.parse(line), source_port: sourcePort };
  }

  const match = line.match(/^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([^"]+)"\s+(\d+)\s+(\d+|-)\s+"([^"]*)"\s+"([^"]*)"(?:\s+([\d.]+))?/);
  if (!match) return null;

  const [, ip, time, request, status, bytes, referer, ua, requestTime] = match;
  return {
    remote_addr: ip,
    time_local: time,
    request,
    host: '-',
    server_port: sourcePort,
    source_port: sourcePort,
    status,
    body_bytes_sent: bytes,
    request_time: requestTime || 0,
    http_user_agent: ua,
    http_referer: referer
  };
}

function resolveService(entry) {
  const host = String(entry.host || entry.http_host || entry.server_name || '');
  const portFromHost = host.match(/:(\d+)$/)?.[1];
  const port = String(portFromHost || entry.server_port || entry.port || entry.source_port || DEFAULT_SERVICE_PORT);
  const service = SERVICE_PORTS[port];

  if (!service) return null;

  return {
    port,
    key: service.key,
    label: service.label
  };
}

function isProbeRequest(method, requestPath, uaInfo) {
  if (!FILTER_SCANS) return false;
  if (!method || method === '-' || !requestPath || requestPath === '-') return true;
  if (uaInfo?.bot) return true;
  if (requestPath === '*' || !requestPath.startsWith('/')) return true;
  if (/\\x[0-9a-f]{2}/i.test(requestPath)) return true;
  if (/[\u0000-\u001f\u007f]/.test(requestPath)) return true;

  const lowerPath = requestPath.toLowerCase().split('?')[0];
  return SUSPICIOUS_PATH_PATTERNS.some(pattern => pattern.test(lowerPath));
}

function normalizePagePath(requestPath) {
  try {
    const parsed = new URL(requestPath, 'http://local');
    const view = parsed.searchParams.get('view');
    if (parsed.pathname === '/' && view === 'logs') return '/?view=logs';
    return parsed.pathname || '/';
  } catch {
    return requestPath.split('?')[0] || requestPath;
  }
}

function parseLogs(logText, sourcePort = DEFAULT_SERVICE_PORT) {
  const lines = logText
    .trim()
    .split('\n')
    .filter(line => line.trim())
    .slice(-MAX_LOG_LINES);

  const logs = [];

  for (const line of lines) {
    try {
      const entry = normalizeEntry(line, sourcePort);
      if (!entry) continue;

      const ip = entry.remote_addr || '-';
      const request = entry.request || '-';
      const requestMatch = request.match(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+(\S+)/);
      const method = requestMatch ? requestMatch[1] : '-';
      const reqPath = requestMatch ? requestMatch[2] : request;
      const service = resolveService(entry);

      if (isStaticResource(reqPath)) continue;
      if (!service) continue;

      const status = Number.parseInt(entry.status, 10) || 0;
      const ua = entry.http_user_agent || '-';
      const rawTime = entry.time_local || '-';
      const { label, timestamp } = parseNginxTime(rawTime);
      const device = parseUserAgent(ua);

      if (isProbeRequest(method, reqPath, device)) {
        continue;
      }

      const geo = lookupGeo(ip);
      const requestTimeMs = Math.round((Number.parseFloat(entry.request_time) || 0) * 1000);
      const pagePath = normalizePagePath(reqPath);

      logs.push({
        ip,
        maskedIp: maskIp(ip),
        geo,
        device,
        method,
        path: reqPath,
        pagePath,
        service,
        port: service.port,
        serviceLabel: service.label,
        status,
        statusGroup: Math.floor(status / 100) * 100,
        requestTimeMs,
        ua,
        time: label,
        timestamp
      });
    } catch {
      // Skip malformed log lines.
    }
  }

  return logs.reverse();
}

function readLogFiles(callback) {
  let pending = LOG_SOURCES.length;
  const chunks = [];

  if (pending === 0) {
    callback([]);
    return;
  }

  for (const source of LOG_SOURCES) {
    fs.readFile(source.path, 'utf8', (err, data) => {
      if (err) {
        console.error(`读取日志文件失败(${source.port}:${source.path}):`, err.message);
      } else {
        chunks.push({ port: source.port, text: data });
      }

      pending -= 1;
      if (pending === 0) {
        callback(chunks);
      }
    });
  }
}

function isAuthorized(req, query) {
  if (!ADMIN_TOKEN) return true;

  const header = req.headers.authorization || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : '';
  const customHeader = req.headers['x-admin-token'] || '';
  const token = query.token || bearer || customHeader;

  return token === ADMIN_TOKEN;
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function applyFilters(logs, query) {
  let result = logs;
  const hours = query.range && query.range !== 'all' ? Number(query.range) : 24;

  if (Number.isFinite(hours) && hours > 0) {
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    result = result.filter(log => log.timestamp && log.timestamp >= cutoff);
  }

  if (query.status && query.status !== 'all') {
    const group = Number(query.status);
    result = result.filter(log => log.statusGroup === group);
  }

  if (query.device && query.device !== 'all') {
    result = result.filter(log => log.device?.type === query.device);
  }

  if (query.q) {
    const keyword = String(query.q).trim().toLowerCase();
    if (keyword) {
      result = result.filter(log => {
        const haystack = `${log.path} ${log.method} ${log.status} ${log.maskedIp} ${log.geo?.country || ''} ${log.device?.browser || ''}`.toLowerCase();
        return haystack.includes(keyword);
      });
    }
  }

  if (query.hideBots === 'true') {
    result = result.filter(log => !log.device?.bot);
  }

  return result;
}

function topEntries(map, keyName, limit = 10) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ [keyName]: key, count }));
}

function getBeijingDate() {
  const bjTime = new Date(Date.now() + 8 * 60 * 60 * 1000);
  return `${bjTime.getUTCFullYear()}-${String(bjTime.getUTCMonth() + 1).padStart(2, '0')}-${String(bjTime.getUTCDate()).padStart(2, '0')}`;
}

function buildHourlyTrend(logs) {
  const buckets = [];
  const now = new Date();
  now.setMinutes(0, 0, 0);

  for (let i = 23; i >= 0; i--) {
    const start = new Date(now.getTime() - i * 60 * 60 * 1000);
    buckets.push({
      key: start.toISOString(),
      label: `${String((start.getUTCHours() + 8) % 24).padStart(2, '0')}:00`,
      count: 0,
      errors: 0
    });
  }

  for (const log of logs) {
    if (!log.timestamp) continue;
    const hour = new Date(log.timestamp);
    hour.setMinutes(0, 0, 0);
    const bucket = buckets.find(item => item.key === hour.toISOString());
    if (!bucket) continue;
    bucket.count += 1;
    if (log.status >= 400) bucket.errors += 1;
  }

  return buckets;
}

function buildStats(logs, allLogs) {
  const statusCodes = {};
  const statusGroups = { 200: 0, 300: 0, 400: 0, 500: 0 };
  const ips = {};
  const paths = {};
  const countries = {};
  const services = {
    home: { key: 'home', port: '80', label: '首页', count: 0 },
    rpc: { key: 'rpc', port: '3000', label: 'RPC', count: 0 },
    code: { key: 'code', port: '8888', label: 'Code', count: 0 }
  };
  const devices = { desktop: 0, mobile: 0, tablet: 0, tv: 0, wearable: 0, bot: 0, unknown: 0 };
  const browsers = {};
  const os = {};
  const today = getBeijingDate();
  let totalRequestTime = 0;
  let timedCount = 0;

  for (const log of logs) {
    ips[log.maskedIp] = (ips[log.maskedIp] || 0) + 1;
    const serviceKey = log.service?.key || 'home';
    if (services[serviceKey]) {
      services[serviceKey].count += 1;
    }
    const pathKey = `${log.serviceLabel || '首页'} ${log.port || '80'}${log.pagePath || log.path}`;
    paths[pathKey] = (paths[pathKey] || 0) + 1;
    statusCodes[log.status] = (statusCodes[log.status] || 0) + 1;
    if (statusGroups[log.statusGroup] !== undefined) {
      statusGroups[log.statusGroup] += 1;
    }

    if (log.geo?.country && log.geo.country !== '-') {
      countries[log.geo.country] = (countries[log.geo.country] || 0) + 1;
    }

    const deviceType = log.device?.type || 'unknown';
    devices[deviceType] = (devices[deviceType] || 0) + 1;

    if (log.device?.browser && log.device.browser !== '-') {
      browsers[log.device.browser] = (browsers[log.device.browser] || 0) + 1;
    }

    if (log.device?.os && log.device.os !== '-') {
      os[log.device.os] = (os[log.device.os] || 0) + 1;
    }

    if (log.requestTimeMs > 0) {
      totalRequestTime += log.requestTimeMs;
      timedCount += 1;
    }
  }

  return {
    total: logs.length,
    totalAll: allLogs.length,
    today: logs.filter(log => log.time.startsWith(today)).length,
    uniqueIps: new Set(logs.map(log => log.maskedIp)).size,
    successRequests: logs.filter(log => log.status >= 200 && log.status < 300).length,
    redirectRequests: logs.filter(log => log.status >= 300 && log.status < 400).length,
    errorRequests: logs.filter(log => log.status >= 400).length,
    avgRequestTimeMs: timedCount ? Math.round(totalRequestTime / timedCount) : 0,
    statusCodes,
    statusGroups,
    devices,
    topIps: topEntries(ips, 'ip', 10),
    serviceVisits: Object.values(services),
    topPaths: topEntries(paths, 'path', 10).map(item => {
      const match = item.path.match(/^(.+?)\s+(\d+)(\/.*)$/);
      return {
        service: match ? match[1] : '首页',
        port: match ? match[2] : '80',
        path: match ? match[3] : item.path,
        count: item.count
      };
    }),
    topCountries: topEntries(countries, 'country', 10),
    topDevices: topEntries(devices, 'device', 8),
    topBrowsers: topEntries(browsers, 'browser', 6),
    topOs: topEntries(os, 'os', 6),
    hourlyTrend: buildHourlyTrend(logs)
  };
}

function sanitizeLogs(logs) {
  return logs.map(log => ({
    ip: log.maskedIp,
    geo: log.geo,
    device: log.device,
    method: log.method,
    path: log.path,
    pagePath: log.pagePath,
    service: log.service,
    port: log.port,
    serviceLabel: log.serviceLabel,
    status: log.status,
    statusGroup: log.statusGroup,
    requestTimeMs: log.requestTimeMs,
    time: log.time
  }));
}

function handleLogs(req, res, query) {
  if (!isAuthorized(req, query)) {
    sendJson(res, 401, { error: 'Unauthorized' });
    return;
  }

  readLogFiles((sources) => {
    const allLogs = sources.flatMap(source => source.text ? parseLogs(source.text, source.port) : []);
    allLogs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    const filteredLogs = applyFilters(allLogs, query);
    const limit = Math.min(Math.max(Number(query.limit || 100), 20), 500);
    const stats = buildStats(filteredLogs, allLogs);

    sendJson(res, 200, {
      logs: sanitizeLogs(filteredLogs.slice(0, limit)),
      stats,
      meta: {
        limit,
        maxLogLines: MAX_LOG_LINES,
        filtered: filteredLogs.length,
        authRequired: Boolean(ADMIN_TOKEN)
      }
    });
  });
}

function handleStats(req, res, query) {
  if (!isAuthorized(req, query)) {
    sendJson(res, 401, { error: 'Unauthorized' });
    return;
  }

  readLogFiles((sources) => {
    const allLogs = sources.flatMap(source => source.text ? parseLogs(source.text, source.port) : []);
    allLogs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    const filteredLogs = applyFilters(allLogs, query);
    sendJson(res, 200, buildStats(filteredLogs, allLogs));
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query || {};

  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/api/logs') {
    handleLogs(req, res, query);
    return;
  }

  if (pathname === '/api/stats') {
    handleStats(req, res, query);
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

initGeoIP().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Log server running on port ${PORT}, reading from ${LOG_SOURCES.map(source => `${source.port}:${source.path}`).join(', ')}`);
  });
});
