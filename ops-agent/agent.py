#!/usr/bin/env python3
"""Small WSL-side agent for reporting health and applying managed FRP proxies."""

from __future__ import annotations

import json
import os
import re
import socket
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

BEGIN = "# BEGIN WANGSHUN OPS MANAGED PROXIES"
END = "# END WANGSHUN OPS MANAGED PROXIES"
DOCKER_ACTIONS = {
    "start": lambda container_id: ["docker", "start", container_id],
    "stop": lambda container_id: ["docker", "stop", "--time", "10", container_id],
    "restart": lambda container_id: ["docker", "restart", "--time", "10", container_id],
    "delete": lambda container_id: ["docker", "rm", container_id],
}
PROTECTED_CONTAINERS = {"wangshun-portfolio"}


def managed_block(tunnels: list[dict]) -> str:
    chunks = [BEGIN]
    for tunnel in tunnels:
        name = str(tunnel["name"])
        protocol = str(tunnel.get("protocol", "tcp"))
        local_port = int(tunnel["localPort"])
        remote_port = int(tunnel["remotePort"])
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]{1,48}", name):
            raise ValueError(f"invalid tunnel name: {name}")
        if protocol not in {"tcp", "udp"}:
            raise ValueError(f"invalid protocol: {protocol}")
        if not (1024 <= local_port <= 65535 and 1024 <= remote_port <= 65535):
            raise ValueError("tunnel port is outside the allowed range")
        chunks.extend([
            "",
            "[[proxies]]",
            f'name = "ops-{name}"',
            f'type = "{protocol}"',
            'localIP = "127.0.0.1"',
            f"localPort = {local_port}",
            f"remotePort = {remote_port}",
        ])
    chunks.extend(["", END])
    return "\n".join(chunks)


def replace_managed_block(config: str, tunnels: list[dict]) -> str:
    block = managed_block(tunnels)
    pattern = re.compile(rf"(?ms)^{re.escape(BEGIN)}$.*?^{re.escape(END)}\s*$")
    if pattern.search(config):
        return pattern.sub(block, config).rstrip() + "\n"
    return config.rstrip() + "\n\n" + block + "\n"


def unmanaged_remote_ports(config: str) -> set[int]:
    pattern = re.compile(rf"(?ms)^{re.escape(BEGIN)}$.*?^{re.escape(END)}\s*$")
    unmanaged = pattern.sub("", config)
    return {int(value) for value in re.findall(r"(?m)^\s*remotePort\s*=\s*(\d+)\s*$", unmanaged)}


class Agent:
    def __init__(self) -> None:
        self.api = os.environ.get("OPS_API_URL", "http://127.0.0.1:8787/api/ops").rstrip("/")
        self.token = os.environ.get("OPS_AGENT_TOKEN", "")
        self.config_path = Path(os.environ.get("FRPC_CONFIG", "/home/wangshun/frp/frp_0.68.0_linux_amd64/frpc.toml"))
        self.frpc_bin = os.environ.get("FRPC_BIN", str(self.config_path.parent / "frpc"))
        self.apply = os.environ.get("OPS_AGENT_APPLY", "false").lower() in {"1", "true", "yes"}
        self.interval = max(10, int(os.environ.get("OPS_AGENT_INTERVAL", "30")))
        if not self.token:
            raise RuntimeError("OPS_AGENT_TOKEN is required")

    def request(self, path: str, method: str = "GET", payload: dict | None = None) -> dict:
        data = json.dumps(payload).encode() if payload is not None else None
        request = urllib.request.Request(
            self.api + path,
            data=data,
            method=method,
            headers={"Content-Type": "application/json", "X-Ops-Agent-Token": self.token},
        )
        with urllib.request.urlopen(request, timeout=10) as response:
            return json.loads(response.read().decode())

    @staticmethod
    def command(*args: str) -> tuple[bool, str]:
        try:
            result = subprocess.run(args, check=False, capture_output=True, text=True, timeout=15)
            return result.returncode == 0, (result.stdout or result.stderr).strip()
        except (OSError, subprocess.SubprocessError) as error:
            return False, str(error)

    def payload(self) -> dict:
        frpc_active, _ = self.command("systemctl", "is-active", "frpc")
        docker_ok, docker_output = self.command(
            "docker", "ps", "-a", "--no-trunc", "--format", '{{json .}}'
        )
        containers = []
        if docker_ok:
            for line in docker_output.splitlines():
                try:
                    row = json.loads(line)
                    labels = set(filter(None, str(row.get("Labels", "")).split(",")))
                    containers.append({
                        "id": row.get("ID"),
                        "name": row.get("Names"),
                        "image": row.get("Image"),
                        "state": row.get("State"),
                        "status": row.get("Status"),
                        "protected": "wangshun.ops.protected=true" in labels,
                    })
                except json.JSONDecodeError:
                    continue
        config = self.config_path.read_text(encoding="utf-8") if self.config_path.exists() else ""
        proxies = []
        for section in config.split("[[proxies]]")[1:]:
            def field(name: str) -> str | None:
                match = re.search(rf'(?m)^\s*{name}\s*=\s*(?:"([^"]+)"|(\d+))', section)
                return (match.group(1) or match.group(2)) if match else None
            name, proxy_type, local_port, remote_port = field("name"), field("type"), field("localPort"), field("remotePort")
            if name:
                proxies.append({"name": name, "type": proxy_type, "localPort": int(local_port) if local_port else None, "remotePort": int(remote_port) if remote_port else None})
        return {"id": "wsl", "hostname": socket.gethostname(), "frpcActive": frpc_active, "proxies": proxies, "containers": containers}

    def sync_frpc(self, tunnels: list[dict]) -> str:
        current = self.config_path.read_text(encoding="utf-8")
        conflicts = unmanaged_remote_ports(current) & {int(item["remotePort"]) for item in tunnels}
        if conflicts:
            raise RuntimeError(f"remote ports already used by unmanaged FRP proxies: {sorted(conflicts)}")
        candidate = replace_managed_block(current, tunnels)
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".toml", delete=False) as temporary:
            temporary.write(candidate)
            temporary_path = Path(temporary.name)
        try:
            verified, output = self.command(self.frpc_bin, "verify", "-c", str(temporary_path))
            if not verified:
                raise RuntimeError(output or "frpc verify failed")
            if not self.apply:
                return "dry-run: frpc configuration verified; no file was changed"
            backup = self.config_path.with_suffix(".toml.ops-backup")
            backup.write_text(current, encoding="utf-8")
            os.chmod(backup, 0o600)
            self.config_path.write_text(candidate, encoding="utf-8")
            os.chmod(self.config_path, 0o600)
            restarted, restart_output = self.command("systemctl", "restart", "frpc")
            if not restarted:
                self.config_path.write_text(current, encoding="utf-8")
                self.command("systemctl", "restart", "frpc")
                raise RuntimeError(restart_output or "frpc restart failed; configuration restored")
            return "frpc configuration verified and service restarted"
        finally:
            temporary_path.unlink(missing_ok=True)

    def docker_action(self, payload: dict) -> str:
        container_id = str(payload.get("containerId", ""))
        container_name = str(payload.get("containerName", ""))
        action = str(payload.get("action", ""))
        if not re.fullmatch(r"[a-f0-9]{64}", container_id, re.IGNORECASE):
            raise ValueError("invalid container ID")
        if action not in DOCKER_ACTIONS:
            raise ValueError("unsupported Docker action")
        exists, inspection = self.command(
            "docker", "inspect", "--format",
            '{{.State.Status}}\t{{index .Config.Labels "wangshun.ops.protected"}}\t{{.Name}}',
            container_id,
        )
        fields = inspection.split("\t") if exists else []
        if len(fields) != 3 or fields[2].lstrip("/") != container_name:
            raise RuntimeError("container no longer matches the requested ID and name")
        state, protected, _ = fields
        if protected == "true" or container_name in PROTECTED_CONTAINERS:
            raise ValueError("protected container cannot be managed")
        if action == "start" and state == "running":
            raise RuntimeError("container is already running")
        if action in {"stop", "restart"} and state != "running":
            raise RuntimeError("container must be running for this action")
        if action == "delete" and state == "running":
            raise RuntimeError("container must be stopped before deletion")
        if not self.apply:
            return f"dry-run: docker {action} validated for {container_name}; no action executed"
        success, output = self.command(*DOCKER_ACTIONS[action](container_id))
        if not success:
            raise RuntimeError(output or f"docker {action} failed")
        return output or f"docker {action} completed for {container_name}"

    def cycle(self) -> None:
        self.request("/agent/heartbeat", "POST", self.payload())
        tasks = self.request("/agent/tasks?agent=wsl").get("tasks", [])
        handled = False
        for task in tasks:
            try:
                if task.get("type") == "sync-frpc":
                    result = self.sync_frpc(task.get("payload", {}).get("tunnels", []))
                elif task.get("type") == "docker-action":
                    result = self.docker_action(task.get("payload", {}))
                else:
                    raise RuntimeError(f"unsupported task type: {task.get('type')}")
                status = "success"
            except Exception as error:  # report task errors without stopping heartbeats
                result, status = str(error), "failed"
            self.request(f"/agent/tasks/{task['id']}", "POST", {"agentId": "wsl", "status": status, "result": result})
            handled = True
        if handled:
            self.request("/agent/heartbeat", "POST", self.payload())

    def run(self) -> None:
        while True:
            try:
                self.cycle()
            except (OSError, urllib.error.URLError, ValueError) as error:
                print(f"ops-agent cycle failed: {error}", flush=True)
            time.sleep(self.interval)


if __name__ == "__main__":
    Agent().run()
