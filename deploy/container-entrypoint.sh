#!/bin/sh

set -eu

node /app/ops/server.mjs &
ops_pid=$!

nginx -t
nginx -g 'daemon off;' &
nginx_pid=$!

shutdown() {
  trap - INT TERM
  kill -TERM "$ops_pid" 2>/dev/null || true
  kill -QUIT "$nginx_pid" 2>/dev/null || true
  wait "$ops_pid" 2>/dev/null || true
  wait "$nginx_pid" 2>/dev/null || true
  exit 0
}

trap shutdown INT TERM

while kill -0 "$ops_pid" 2>/dev/null && kill -0 "$nginx_pid" 2>/dev/null; do
  sleep 2
done

echo "Nginx or Ops API stopped unexpectedly; terminating the container." >&2
kill -TERM "$ops_pid" 2>/dev/null || true
kill -QUIT "$nginx_pid" 2>/dev/null || true
wait "$ops_pid" 2>/dev/null || true
wait "$nginx_pid" 2>/dev/null || true
exit 1
