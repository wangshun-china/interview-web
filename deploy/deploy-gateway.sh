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

: "${OPS_INITIAL_PASSWORD:?OPS_INITIAL_PASSWORD is required}"
: "${OPS_AGENT_TOKEN:?OPS_AGENT_TOKEN is required}"
: "${LETSENCRYPT_EMAIL:?LETSENCRYPT_EMAIL is required}"
# Fallbacks used only on the first post-split deploy, before .env carries both
# image refs: each workflow exports the :latest ref of the OTHER service too.
PORTFOLIO_LATEST="${PORTFOLIO_LATEST:-}"
GATEWAY_LATEST="${GATEWAY_LATEST:-}"

install -d -m 700 "$DEPLOY_DIR"
install -d -m 755 \
  "$DEPLOY_DIR/certbot/conf" \
  "$DEPLOY_DIR/certbot/lib" \
  "$DEPLOY_DIR/certbot/log" \
  "$DEPLOY_DIR/certbot/www/.well-known/acme-challenge" \
  "$DEPLOY_DIR/nginx-logs" \
  "$DEPLOY_DIR/routes"
install -d -m 700 "$DEPLOY_DIR/ops-data"
# Keep the pre-migration single-service compose for rollback until the new
# topology has passed health checks; captured only while the gateway has
# never existed, so .previous always holds the true legacy topology.
if [[ -z "$(docker ps -aq --filter name=^wangshun-gateway$)" \
  && -f "$DEPLOY_DIR/docker-compose.yml" \
  && ! -f "$DEPLOY_DIR/docker-compose.yml.previous" ]]; then
  cp "$DEPLOY_DIR/docker-compose.yml" "$DEPLOY_DIR/docker-compose.yml.previous"
  cp "$DEPLOY_DIR/.env" "$DEPLOY_DIR/.env.previous" 2>/dev/null || true
fi
install -m 644 "$SOURCE_DIR/docker-compose.yml" "$DEPLOY_DIR/docker-compose.yml"

# Each deploy workflow passes exactly one of these two; the other image ref is
# preserved from the current .env so a portfolio push never rolls the gateway
# back to an older tag (and vice versa).
CURRENT_PORTFOLIO_IMAGE=""
CURRENT_GATEWAY_IMAGE=""
if [[ -f "$DEPLOY_DIR/.env" ]]; then
  # shellcheck disable=SC1091
  source "$DEPLOY_DIR/.env" || true
  CURRENT_PORTFOLIO_IMAGE="${PORTFOLIO_IMAGE:-}"
  CURRENT_GATEWAY_IMAGE="${GATEWAY_IMAGE:-}"
fi
PORTFOLIO_IMAGE="${DEPLOY_PORTFOLIO_IMAGE:-$CURRENT_PORTFOLIO_IMAGE}"
GATEWAY_IMAGE="${DEPLOY_GATEWAY_IMAGE:-$CURRENT_GATEWAY_IMAGE}"
PORTFOLIO_IMAGE="${PORTFOLIO_IMAGE:-$PORTFOLIO_LATEST}"
GATEWAY_IMAGE="${GATEWAY_IMAGE:-$GATEWAY_LATEST}"
: "${PORTFOLIO_IMAGE:?PORTFOLIO_IMAGE is required (pass DEPLOY_PORTFOLIO_IMAGE or seed .env)}"
: "${GATEWAY_IMAGE:?GATEWAY_IMAGE is required (pass DEPLOY_GATEWAY_IMAGE or seed .env)}"

ensure_image() {
  docker image inspect "$1" >/dev/null 2>&1 || docker pull "$1"
}

umask 077
{
  printf 'PORTFOLIO_IMAGE=%s\n' "$PORTFOLIO_IMAGE"
  printf 'GATEWAY_IMAGE=%s\n' "$GATEWAY_IMAGE"
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

rollback_cutover() {
  echo "Rolling back to legacy all-in-one container" >&2
  if [[ -f "$DEPLOY_DIR/docker-compose.yml.previous" && -n "${LEGACY_IMAGE:-}" ]]; then
    cp "$DEPLOY_DIR/docker-compose.yml.previous" "$DEPLOY_DIR/docker-compose.yml"
    umask 077
    {
      printf 'INTERVIEW_IMAGE=%s\n' "$LEGACY_IMAGE"
      printf 'OPS_INITIAL_PASSWORD=%s\n' "$OPS_INITIAL_PASSWORD"
      printf 'OPS_AGENT_TOKEN=%s\n' "$OPS_AGENT_TOKEN"
    } > "$DEPLOY_DIR/.env"
    docker compose --project-name wangshun-portfolio \
      --env-file "$DEPLOY_DIR/.env" \
      -f "$DEPLOY_DIR/docker-compose.yml" up -d --no-deps --force-recreate portfolio
  fi
}

gateway_running="$(docker ps -q --filter name=^wangshun-gateway$)"
if [[ -z "$gateway_running" ]]; then
  # First-run cutover (or gateway stopped): the host ports 80/443 are still
  # held by the legacy all-in-one container, so recreate portfolio WITHOUT
  # host ports first, then start the gateway. Edge-down window is the gap
  # between the two steps, a few seconds. On a fresh host there is no legacy
  # container, so this also works as plain first boot.
  echo "Gateway container not running; performing first-run cutover"
  LEGACY_IMAGE="$(docker inspect wangshun-portfolio --format '{{.Config.Image}}' 2>/dev/null || true)"

  ensure_image "$PORTFOLIO_IMAGE"
  ensure_image "$GATEWAY_IMAGE"
  compose up -d --no-deps --force-recreate portfolio
  if ! compose up -d --no-deps gateway; then
    echo "Gateway failed to start (ports busy?); restoring legacy container" >&2
    docker rm -f wangshun-gateway >/dev/null 2>&1 || true
    rollback_cutover
    exit 1
  fi

  # Edge liveness over plain HTTP: works with or without a certificate, so
  # this doubles as the fresh-host first-boot check.
  for attempt in $(seq 1 20); do
    if curl -fsS --max-time 3 --noproxy '*' \
      --resolve "wangshun.work:80:127.0.0.1" \
      "http://wangshun.work/" -o /dev/null 2>/dev/null; then
      break
    fi
    if [[ "$attempt" == 20 ]]; then
      docker logs --tail 50 wangshun-gateway 2>&1 | tail -30 || true
      echo "Gateway edge did not come up after cutover; restoring legacy container" >&2
      docker rm -f wangshun-gateway >/dev/null 2>&1 || true
      rollback_cutover
      exit 1
    fi
    sleep 2
  done
  echo "Cutover complete; gateway is serving the edge"
else
  # Steady state: compose recreates only the service whose image/config changed.
  compose up -d --remove-orphans --pull never
fi

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

compose exec -T gateway nginx -t
for attempt in $(seq 1 30); do
  if compose exec -T gateway sh -c \
    'test -s /run/nginx.pid && kill -0 "$(cat /run/nginx.pid)"'; then
    break
  fi
  if [[ "$attempt" == 30 ]]; then
    compose logs --tail 100 gateway
    echo "Nginx did not become ready in time." >&2
    exit 1
  fi
  sleep 1
done
compose exec -T gateway nginx -s reload

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

# New topology verified end to end; the legacy rollback copies are obsolete.
rm -f "$DEPLOY_DIR/docker-compose.yml.previous" "$DEPLOY_DIR/.env.previous"

compose ps
