#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "install.sh must run as root" >&2
  exit 1
fi
if [[ -z "${OPS_AGENT_TOKEN:-}" ]]; then
  IFS= read -r OPS_AGENT_TOKEN
fi
: "${OPS_AGENT_TOKEN:?OPS_AGENT_TOKEN is required}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPS_API_URL="${OPS_API_URL:-https://ops.wangshun.work/api/ops}"
FRPC_CONFIG="${FRPC_CONFIG:-/home/wangshun/frp/frp_0.68.0_linux_amd64/frpc.toml}"
FRPC_BIN="${FRPC_BIN:-/home/wangshun/frp/frp_0.68.0_linux_amd64/frpc}"
OPS_AGENT_APPLY="${OPS_AGENT_APPLY:-true}"
OPS_AGENT_INTERVAL="${OPS_AGENT_INTERVAL:-30}"

install -d -m 755 /home/wangshun/ops-agent
install -m 755 "$SCRIPT_DIR/agent.py" /home/wangshun/ops-agent/agent.py
install -m 644 "$SCRIPT_DIR/wangshun-ops-agent.service" /etc/systemd/system/wangshun-ops-agent.service
{
  printf 'OPS_API_URL=%s\n' "$OPS_API_URL"
  printf 'OPS_AGENT_TOKEN=%s\n' "$OPS_AGENT_TOKEN"
  printf 'FRPC_CONFIG=%s\n' "$FRPC_CONFIG"
  printf 'FRPC_BIN=%s\n' "$FRPC_BIN"
  printf 'OPS_AGENT_APPLY=%s\n' "$OPS_AGENT_APPLY"
  printf 'OPS_AGENT_INTERVAL=%s\n' "$OPS_AGENT_INTERVAL"
} > /etc/wangshun-ops-agent.env
chmod 600 /etc/wangshun-ops-agent.env
systemctl daemon-reload
systemctl enable wangshun-ops-agent.service
systemctl restart wangshun-ops-agent.service
systemctl is-active --quiet wangshun-ops-agent.service
