#!/usr/bin/env bash

set -Eeuo pipefail

DEPLOY_DIR="${GATEWAY_DEPLOY_DIR:?GATEWAY_DEPLOY_DIR is required}"
CERTBOT_IMAGE="certbot/certbot:latest"
CERT_PATH="$DEPLOY_DIR/certbot/conf/live/wangshun.work/fullchain.pem"
: "${OPS_AGENT_TOKEN:?OPS_AGENT_TOKEN is required}"

report_job() {
  local status="$1"
  local message="$2"
  curl -fsS --max-time 10 \
    -H "Content-Type: application/json" \
    -H "X-Ops-Agent-Token: $OPS_AGENT_TOKEN" \
    --data "{\"name\":\"certificate-renewal\",\"status\":\"$status\",\"message\":\"$message\"}" \
    https://ops.wangshun.work/api/ops/agent/jobs >/dev/null || true
}

trap 'report_job failed "renewal script failed at line $LINENO"' ERR

[[ -f "$CERT_PATH" ]] || {
  echo "Certificate is not initialized: $CERT_PATH" >&2
  exit 1
}

docker run --rm \
  -v "$DEPLOY_DIR/certbot/conf:/etc/letsencrypt" \
  -v "$DEPLOY_DIR/certbot/lib:/var/lib/letsencrypt" \
  -v "$DEPLOY_DIR/certbot/log:/var/log/letsencrypt" \
  -v "$DEPLOY_DIR/certbot/www:/var/www/certbot" \
  "$CERTBOT_IMAGE" renew \
    --non-interactive \
    --webroot \
    --webroot-path /var/www/certbot \
    --quiet

docker exec wangshun-portfolio nginx -t
docker exec wangshun-portfolio nginx -s reload
curl -fsS --retry 5 --retry-delay 3 --retry-all-errors \
  https://api.wangshun.work/health |
  grep -q '"service":"memoir-server"'
curl -fsS -o /dev/null --retry 5 --retry-delay 3 --retry-all-errors \
  https://agent.wangshun.work/
report_job success "certificate check/renewal and nginx reload completed"
