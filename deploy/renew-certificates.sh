#!/usr/bin/env bash

set -Eeuo pipefail

DEPLOY_DIR="${GATEWAY_DEPLOY_DIR:?GATEWAY_DEPLOY_DIR is required}"
CERTBOT_IMAGE="certbot/certbot:latest"
CERT_PATH="$DEPLOY_DIR/certbot/conf/live/wangshun.work/fullchain.pem"

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
