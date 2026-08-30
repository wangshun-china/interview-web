#!/usr/bin/env bash

set -Eeuo pipefail

SOURCE_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
DEPLOY_DIR="${GATEWAY_DEPLOY_DIR:?GATEWAY_DEPLOY_DIR is required}"
CERT_NAME="wangshun.work"
# Pinned tag; the image is pre-pulled on the Aliyun runner so cert issuance
# never depends on reaching docker.io at deploy time.
CERTBOT_IMAGE="${CERTBOT_IMAGE:-certbot/certbot:v5.7.0}"
DOMAINS=(
  wangshun.work
  www.wangshun.work
  ai-coder.wangshun.work
  rpc.wangshun.work
  agent.wangshun.work
  api.wangshun.work
  ops.wangshun.work
  jsm.wangshun.work
)
HEALTHCHECK_DOMAINS=(
  wangshun.work
  www.wangshun.work
  agent.wangshun.work
  ops.wangshun.work
)

: "${DEPLOY_IMAGE:?DEPLOY_IMAGE is required}"
: "${OPS_INITIAL_PASSWORD:?OPS_INITIAL_PASSWORD is required}"
: "${OPS_AGENT_TOKEN:?OPS_AGENT_TOKEN is required}"
: "${LETSENCRYPT_EMAIL:?LETSENCRYPT_EMAIL is required}"

install -d -m 700 "$DEPLOY_DIR"
install -d -m 755 \
  "$DEPLOY_DIR/certbot/conf" \
  "$DEPLOY_DIR/certbot/lib" \
  "$DEPLOY_DIR/certbot/log" \
  "$DEPLOY_DIR/certbot/www/.well-known/acme-challenge" \
  "$DEPLOY_DIR/nginx-logs" \
  "$DEPLOY_DIR/routes"
install -d -m 700 "$DEPLOY_DIR/ops-data"
install -m 644 "$SOURCE_DIR/docker-compose.yml" "$DEPLOY_DIR/docker-compose.yml"

umask 077
{
  printf 'INTERVIEW_IMAGE=%s\n' "$DEPLOY_IMAGE"
  printf 'OPS_INITIAL_PASSWORD=%s\n' "$OPS_INITIAL_PASSWORD"
  printf 'OPS_AGENT_TOKEN=%s\n' "$OPS_AGENT_TOKEN"
} > "$DEPLOY_DIR/.env.next"
mv "$DEPLOY_DIR/.env.next" "$DEPLOY_DIR/.env"

CERT_PATH="$DEPLOY_DIR/certbot/conf/live/$CERT_NAME/fullchain.pem"
if [[ -f "$CERT_PATH" ]]; then
  certificate_was_present=true
  certificate_needs_update=false
  for domain in "${DOMAINS[@]}"; do
    if ! openssl x509 -in "$CERT_PATH" -noout -checkhost "$domain" 2>&1 |
      grep -Fq "Hostname $domain does match certificate"; then
      certificate_needs_update=true
      break
    fi
  done
  install -m 644 "$SOURCE_DIR/nginx-https.conf" "$DEPLOY_DIR/nginx.conf"
else
  certificate_was_present=false
  certificate_needs_update=true
  install -m 644 "$SOURCE_DIR/nginx-http.conf" "$DEPLOY_DIR/nginx.conf"
fi

compose() {
  docker compose --project-name wangshun-portfolio \
    --env-file "$DEPLOY_DIR/.env" \
    -f "$DEPLOY_DIR/docker-compose.yml" "$@"
}

compose up -d --remove-orphans --pull never

if [[ "$certificate_needs_update" == true ]]; then
  challenge_token="gateway-$GITHUB_RUN_ID"
  printf '%s\n' "$challenge_token" > \
    "$DEPLOY_DIR/certbot/www/.well-known/acme-challenge/$challenge_token"
  chmod 644 \
    "$DEPLOY_DIR/certbot/www/.well-known/acme-challenge/$challenge_token"

  for domain in "${DOMAINS[@]}"; do
    curl -fsS --retry 10 --retry-delay 2 --retry-all-errors \
      --noproxy '*' \
      --resolve "$domain:80:127.0.0.1" \
      "http://$domain/.well-known/acme-challenge/$challenge_token" |
      grep -Fxq "$challenge_token"
  done

  domain_args=()
  for domain in "${DOMAINS[@]}"; do
    domain_args+=(-d "$domain")
  done

  certbot_args=()
  if [[ "$certificate_was_present" == true ]]; then
    certbot_args+=(--expand)
  fi

  if ! docker image inspect "$CERTBOT_IMAGE" >/dev/null 2>&1; then
    docker pull "$CERTBOT_IMAGE" || true
    docker image inspect "$CERTBOT_IMAGE" >/dev/null 2>&1 \
      || CERTBOT_IMAGE="certbot/certbot:latest"
  fi

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
      "${certbot_args[@]}" \
      "${domain_args[@]}"
fi

[[ -f "$CERT_PATH" ]] || {
  echo "Certificate was not created: $CERT_PATH" >&2
  exit 1
}

if [[ "$certificate_was_present" == false ]]; then
  cp "$DEPLOY_DIR/nginx.conf" "$DEPLOY_DIR/nginx.conf.previous"
  install -m 644 "$SOURCE_DIR/nginx-https.conf" "$DEPLOY_DIR/nginx.conf"

  if ! compose up -d --remove-orphans --pull never --force-recreate || \
     ! compose exec -T portfolio nginx -t; then
    cp "$DEPLOY_DIR/nginx.conf.previous" "$DEPLOY_DIR/nginx.conf"
    compose up -d --remove-orphans --pull never --force-recreate
    echo "HTTPS nginx configuration is invalid; restored the previous configuration." >&2
    exit 1
  fi
fi

compose exec -T portfolio nginx -t
for attempt in $(seq 1 30); do
  if compose exec -T portfolio sh -c \
    'test -s /run/nginx.pid && kill -0 "$(cat /run/nginx.pid)"'; then
    break
  fi
  if [[ "$attempt" == 30 ]]; then
    compose logs --tail 100 portfolio
    echo "Nginx did not become ready in time." >&2
    exit 1
  fi
  sleep 1
done
compose exec -T portfolio nginx -s reload

for domain in "${HEALTHCHECK_DOMAINS[@]}"; do
  curl -fsS -o /dev/null --retry 10 --retry-delay 3 --retry-all-errors \
    --noproxy '*' \
    --resolve "$domain:443:127.0.0.1" "https://$domain/"
done
curl -fsS --retry 10 --retry-delay 3 --retry-all-errors \
  --noproxy '*' \
  --resolve "ops.wangshun.work:443:127.0.0.1" \
  "https://ops.wangshun.work/api/ops/health" |
  grep -Fq '"service":"wangshun-ops"'
curl -fsS --max-time 10 \
  -H "Content-Type: application/json" \
  -H "X-Ops-Agent-Token: $OPS_AGENT_TOKEN" \
  --data '{"name":"gateway-deployment","status":"success","message":"frontend, ops API and nginx health checks passed"}' \
  --resolve "ops.wangshun.work:443:127.0.0.1" \
  "https://ops.wangshun.work/api/ops/agent/jobs" >/dev/null

compose ps
