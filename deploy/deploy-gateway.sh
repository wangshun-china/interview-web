#!/usr/bin/env bash

set -Eeuo pipefail

SOURCE_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
DEPLOY_DIR="${GATEWAY_DEPLOY_DIR:?GATEWAY_DEPLOY_DIR is required}"
CERT_NAME="wangshun.work"
CERTBOT_IMAGE="certbot/certbot:latest"
DOMAINS=(
  wangshun.work
  www.wangshun.work
  ai-coder.wangshun.work
  rpc.wangshun.work
  api.wangshun.work
)
ROOT_DOMAINS=(
  wangshun.work
  www.wangshun.work
  ai-coder.wangshun.work
  rpc.wangshun.work
)

: "${DEPLOY_IMAGE:?DEPLOY_IMAGE is required}"
: "${LETSENCRYPT_EMAIL:?LETSENCRYPT_EMAIL is required}"

install -d -m 700 "$DEPLOY_DIR"
install -d -m 755 \
  "$DEPLOY_DIR/certbot/conf" \
  "$DEPLOY_DIR/certbot/lib" \
  "$DEPLOY_DIR/certbot/log" \
  "$DEPLOY_DIR/certbot/www/.well-known/acme-challenge"
install -m 644 "$SOURCE_DIR/docker-compose.yml" "$DEPLOY_DIR/docker-compose.yml"

umask 077
printf 'INTERVIEW_IMAGE=%s\n' "$DEPLOY_IMAGE" > "$DEPLOY_DIR/.env.next"
mv "$DEPLOY_DIR/.env.next" "$DEPLOY_DIR/.env"

CERT_PATH="$DEPLOY_DIR/certbot/conf/live/$CERT_NAME/fullchain.pem"
if [[ -f "$CERT_PATH" ]]; then
  install -m 644 "$SOURCE_DIR/nginx-https.conf" "$DEPLOY_DIR/nginx.conf"
else
  install -m 644 "$SOURCE_DIR/nginx-http.conf" "$DEPLOY_DIR/nginx.conf"
fi

compose() {
  docker compose --project-name wangshun-portfolio \
    --env-file "$DEPLOY_DIR/.env" \
    -f "$DEPLOY_DIR/docker-compose.yml" "$@"
}

compose up -d --remove-orphans --pull never

if [[ ! -f "$CERT_PATH" ]]; then
  challenge_token="gateway-$GITHUB_RUN_ID"
  printf '%s\n' "$challenge_token" > \
    "$DEPLOY_DIR/certbot/www/.well-known/acme-challenge/$challenge_token"

  for domain in "${DOMAINS[@]}"; do
    curl -fsS --retry 10 --retry-delay 2 --retry-all-errors \
      --resolve "$domain:80:127.0.0.1" \
      "http://$domain/.well-known/acme-challenge/$challenge_token" |
      grep -Fxq "$challenge_token"
  done

  domain_args=()
  for domain in "${DOMAINS[@]}"; do
    domain_args+=(-d "$domain")
  done

  docker run --rm \
    -v "$DEPLOY_DIR/certbot/conf:/etc/letsencrypt" \
    -v "$DEPLOY_DIR/certbot/lib:/var/lib/letsencrypt" \
    -v "$DEPLOY_DIR/certbot/log:/var/log/letsencrypt" \
    -v "$DEPLOY_DIR/certbot/www:/var/www/certbot" \
    "$CERTBOT_IMAGE" certonly \
      --non-interactive \
      --webroot \
      --webroot-path /var/www/certbot \
      --cert-name "$CERT_NAME" \
      --email "$LETSENCRYPT_EMAIL" \
      --agree-tos \
      --no-eff-email \
      "${domain_args[@]}"
fi

[[ -f "$CERT_PATH" ]] || {
  echo "Certificate was not created: $CERT_PATH" >&2
  exit 1
}

cp "$DEPLOY_DIR/nginx.conf" "$DEPLOY_DIR/nginx.conf.previous"
install -m 644 "$SOURCE_DIR/nginx-https.conf" "$DEPLOY_DIR/nginx.conf"

if ! compose exec -T portfolio nginx -t; then
  cp "$DEPLOY_DIR/nginx.conf.previous" "$DEPLOY_DIR/nginx.conf"
  compose exec -T portfolio nginx -t
  compose exec -T portfolio nginx -s reload
  echo "HTTPS nginx configuration is invalid; restored the previous configuration." >&2
  exit 1
fi
compose exec -T portfolio nginx -s reload

for domain in "${ROOT_DOMAINS[@]}"; do
  curl -fsS -o /dev/null --retry 10 --retry-delay 3 --retry-all-errors \
    --resolve "$domain:443:127.0.0.1" "https://$domain/"
done
curl -fsS --retry 10 --retry-delay 3 --retry-all-errors \
  --resolve "api.wangshun.work:443:127.0.0.1" \
  "https://api.wangshun.work/health" |
  grep -q '"service":"memoir-server"'

compose ps
