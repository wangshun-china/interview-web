# Wangshun Ops WSL Agent

The WSL agent reports WSL/FRP/Docker health and polls for tunnel sync tasks. It only
owns the block between `BEGIN/END WANGSHUN OPS MANAGED PROXIES` in `frpc.toml`.

## GitHub secrets

- `OPS_INITIAL_PASSWORD`: set to the requested initial password (`wangshun`), then
  change it from the Ops account settings after the first login.
- `OPS_AGENT_TOKEN`: use a long random value. The same value is installed in WSL.

## Install in Ubuntu-22.04 WSL

Run the installer with the shared agent token. It writes the root-owned private env
file, installs the systemd unit and starts the agent:

```bash
printf '%s\n' 'replace-with-a-long-random-value' | sudo bash ops-agent/install.sh
```

The resulting `/etc/wangshun-ops-agent.env` contains:

```ini
OPS_API_URL=https://ops.wangshun.work/api/ops
OPS_AGENT_TOKEN=replace-with-the-github-secret
FRPC_CONFIG=/home/wangshun/frp/frp_0.68.0_linux_amd64/frpc.toml
FRPC_BIN=/home/wangshun/frp/frp_0.68.0_linux_amd64/frpc
OPS_AGENT_APPLY=true
OPS_AGENT_INTERVAL=30
```

The unit runs as root because applying a verified task must restart the system-level
`frpc.service`. Its filesystem is read-only except for the exact FRP directory, and
the agent only accepts validated `sync-frpc` and fixed Docker control tasks from the
token-authenticated API. Docker deletion never forces a running container or removes
its volumes.

Keep `OPS_AGENT_APPLY=false` for a dry run: tasks are validated with `frpc verify`,
but the real configuration and service are not changed.
