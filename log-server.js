const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const maxmind = require('maxmind');
const UAParser = require('ua-parser-js');

const PORT = 3000;
const LOG_FILE = process.env.LOG_FILE || '/var/log/nginx/access.log';
const GEOLITE_DB = process.env.GEOLITE_DB || '/app/GeoLite2-City.mmdb';

let geoipReader = null;
const uaParser = new UAParser();

// 静态资源后缀（过滤掉）
const STATIC_EXTENSIONS = [
  '.css', '.js', '.mjs', '.ts', '.map',
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.avif',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.mp4', '.webm', '.mp3', '.wav', '.ogg'
];

// 判断是否为静态资源
function isStaticResource(path) {
  const lowerPath = path.toLowerCase().split('?')[0];
  return STATIC_EXTENSIONS.some(ext => lowerPath.endsWith(ext));
}

// UTC 时间转北京时间
function toBeijingTime(nginxTime) {
  // Nginx 格式: 12/Mar/2026:11:06:40 +0000
  try {
    // 替换为标准格式
    const normalized = nginxTime.replace(/(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2})/, '$2 $1, $3 $4:$5:$6');
    const date = new Date(normalized);

    // 检查是否有效日期
    if (isNaN(date.getTime())) {
      return nginxTime; // 返回原始值
    }

    // 加8小时得到北京时间
    const bjTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);

    // 格式化: 2026-03-12 19:06:40
    const year = bjTime.getUTCFullYear();
    const month = String(bjTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(bjTime.getUTCDate()).padStart(2, '0');
    const hour = String(bjTime.getUTCHours()).padStart(2, '0');
    const minute = String(bjTime.getUTCMinutes()).padStart(2, '0');
    const second = String(bjTime.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  } catch (e) {
    return nginxTime;
  }
}

// 初始化 GeoIP 数据库
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

// IP 地理位置查询
function lookupGeo(ip) {
  if (!geoipReader || !ip || ip === '-') {
    return null;
  }

  // 跳过内网 IP
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
  } catch (err) {
    return null;
  }
}

// 解析 User-Agent
function parseUserAgent(ua) {
  if (!ua || ua === '-') {
    return { type: 'unknown', os: '-', browser: '-', device: '-' };
  }

  uaParser.setUA(ua);
  const result = uaParser.getResult();

  // 判断设备类型
  let deviceType = 'desktop';
  if (result.device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (result.device.type === 'tablet') {
    deviceType = 'tablet';
  } else if (result.device.type === 'smarttv' || result.device.type === 'tv') {
    deviceType = 'tv';
  } else if (result.device.type === 'wearable') {
    deviceType = 'wearable';
  }

  // 简化浏览器名称
  const browserName = result.browser.name || '-';
  const browserVersion = result.browser.version ? `${result.browser.name} ${result.browser.major || result.browser.version.split('.')[0]}` : browserName;

  // 简化操作系统
  const osName = result.os.name || '-';
  const osVersion = result.os.version ? `${result.os.name} ${result.os.version}` : osName;

  return {
    type: deviceType,
    os: osVersion,
    browser: browserVersion,
    device: result.device.model || result.device.vendor || '-'
  };
}

// 解析日志行
function parseLogs(logText) {
  const lines = logText.trim().split('\n').filter(line => line.trim());
  const logs = [];

  for (const line of lines) {
    try {
      let entry;
      if (line.startsWith('{')) {
        entry = JSON.parse(line);
      } else {
        // 解析标准 Nginx Combined 格式
        const match = line.match(/^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([^"]+)"\s+(\d+)\s+(\d+|-)\s+"([^"]*)"\s+"([^"]*)"/);
        if (match) {
          const [, ip, time, request, status, , referer, ua] = match;
          entry = { remote_addr: ip, time_local: time, request, status, http_user_agent: ua, http_referer: referer };
        } else {
          continue;
        }
      }

      const ip = entry.remote_addr || '-';
      const requestMatch = entry.request?.match(/^(GET|POST|PUT|DELETE|HEAD|OPTIONS)\s+(\S+)/);
      const method = requestMatch ? requestMatch[1] : '-';
      const reqPath = requestMatch ? requestMatch[2] : entry.request || '-';

      // 过滤静态资源请求
      if (isStaticResource(reqPath)) {
        continue;
      }

      const status = parseInt(entry.status) || 0;
      const ua = entry.http_user_agent || '-';
      const rawTime = entry.time_local || '-';

      // 转换为北京时间
      const time = toBeijingTime(rawTime);

      // 解析地理位置和设备信息
      const geo = lookupGeo(ip);
      const device = parseUserAgent(ua);

      logs.push({
        ip,
        geo,
        device,
        method,
        path: reqPath,
        status,
        ua,
        time
      });
    } catch (e) {
      // 跳过无法解析的行
    }
  }

  return logs.reverse();
}

// 读取日志文件
function readLogFile(callback) {
  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('读取日志文件失败:', err.message);
      callback('');
      return;
    }
    callback(data);
  });
}

// 路由处理
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (pathname === '/api/logs') {
    readLogFile((logText) => {
      if (!logText) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ logs: [], stats: { total: 0, topIps: [], topPaths: [], topCountries: [], topDevices: [], statusCodes: {} } }));
        return;
      }

      const logs = parseLogs(logText);

      // 统计信息
      const stats = {
        total: logs.length,
        ips: {},
        paths: {},
        countries: {},
        devices: { mobile: 0, tablet: 0, desktop: 0, tv: 0, wearable: 0, unknown: 0 },
        browsers: {},
        os: {},
        statusCodes: {}
      };

      for (const log of logs) {
        // IP 统计
        stats.ips[log.ip] = (stats.ips[log.ip] || 0) + 1;
        // 路径统计
        stats.paths[log.path] = (stats.paths[log.path] || 0) + 1;
        // 状态码统计
        const statusGroup = Math.floor(log.status / 100) * 100;
        stats.statusCodes[statusGroup] = (stats.statusCodes[statusGroup] || 0) + 1;

        // 地理位置统计
        if (log.geo?.country && log.geo.country !== '-') {
          stats.countries[log.geo.country] = (stats.countries[log.geo.country] || 0) + 1;
        }

        // 设备类型统计
        if (log.device?.type) {
          stats.devices[log.device.type] = (stats.devices[log.device.type] || 0) + 1;
        }

        // 浏览器统计
        if (log.device?.browser && log.device.browser !== '-') {
          stats.browsers[log.device.browser] = (stats.browsers[log.device.browser] || 0) + 1;
        }

        // 操作系统统计
        if (log.device?.os && log.device.os !== '-') {
          stats.os[log.device.os] = (stats.os[log.device.os] || 0) + 1;
        }
      }

      // 转换为数组并排序
      stats.topIps = Object.entries(stats.ips)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([ip, count]) => ({ ip, count }));

      stats.topPaths = Object.entries(stats.paths)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, count]) => ({ path, count }));

      stats.topCountries = Object.entries(stats.countries)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([country, count]) => ({ country, count }));

      stats.topBrowsers = Object.entries(stats.browsers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([browser, count]) => ({ browser, count }));

      stats.topOs = Object.entries(stats.os)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([os, count]) => ({ os, count }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ logs: logs.slice(0, 200), stats }));
    });
  } else if (pathname === '/api/stats') {
    readLogFile((logText) => {
      if (!logText) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ total: 0, today: 0, uniqueIps: 0, topCountries: [], deviceBreakdown: {} }));
        return;
      }

      const logs = parseLogs(logText);

      // 获取北京时间日期
      const now = new Date();
      const bjTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
      const today = `${bjTime.getUTCFullYear()}-${String(bjTime.getUTCMonth() + 1).padStart(2, '0')}-${String(bjTime.getUTCDate()).padStart(2, '0')}`;

      const countries = {};
      const devices = { mobile: 0, tablet: 0, desktop: 0, unknown: 0 };

      for (const log of logs) {
        if (log.geo?.country && log.geo.country !== '-') {
          countries[log.geo.country] = (countries[log.geo.country] || 0) + 1;
        }
        if (log.device?.type) {
          devices[log.device.type] = (devices[log.device.type] || 0) + 1;
        }
      }

      const stats = {
        total: logs.length,
        today: logs.filter(l => l.time.startsWith(today)).length,
        uniqueIps: new Set(logs.map(l => l.ip)).size,
        topCountries: Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([country, count]) => ({ country, count })),
        deviceBreakdown: devices
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(stats));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// 启动服务器
initGeoIP().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Log server running on port ${PORT}, reading from ${LOG_FILE}`);
  });
});