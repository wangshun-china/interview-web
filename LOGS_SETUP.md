# 部署步骤

## 1. 重新构建前端

```bash
cd resume
npm install
npm run build
```

## 2. 重新构建并启动 Docker 容器

```bash
# 可选：开启日志页令牌保护
# PowerShell: $env:LOG_ADMIN_TOKEN="your-token"
# Bash: export LOG_ADMIN_TOKEN="your-token"

# 可选：关闭公网扫描流量过滤（默认开启，不建议关闭）
# PowerShell: $env:FILTER_SCANS="false"
# Bash: export FILTER_SCANS=false

# 可选：统计多个业务入口日志，格式为 端口:日志路径，多个用逗号分隔
# PowerShell: $env:LOG_FILES="80:/var/log/nginx/access.log,3000:/var/log/rpc/access.log,8888:/var/log/code/access.log"
# Bash: export LOG_FILES="80:/var/log/nginx/access.log,3000:/var/log/rpc/access.log,8888:/var/log/code/access.log"

# 停止现有容器
docker-compose down

# 构建日志服务镜像并启动
docker-compose up -d --build
```

## 3. 查看日志页面

访问: `http://你的服务器IP/?view=logs`

或点击首页底部的 "查看访问日志" 链接。

## 4. 直接查看日志

```bash
# 实时查看容器日志
docker logs -f wangshun-portfolio

# 或查看宿主机上的日志文件
cat logs/access.log

# 实时查看日志文件
tail -f logs/access.log
```

## 5. 端口说明

- **80**: 前端网站
- **3001**: 宿主机日志服务 API 映射端口
- **3000**: Docker 网络内日志服务端口

前端通过 nginx 反向代理访问 `/api/logs` 来获取日志数据。
