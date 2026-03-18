#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTAINER_NAME="saas-dashboard-frontend-container"
cd "$SCRIPT_DIR"

log_info() { echo -e "\e[32m[INFO]\e[0m $1"; }

# Kill dev server by PID file
if [ -f .dev_server_pid ]; then
  PID=$(cat .dev_server_pid)
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID" 2>/dev/null || true
    log_info "Stopped dev server (PID $PID)."
  fi
  rm -f .dev_server_pid
fi

# Stop Docker container if present
if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -q "^${CONTAINER_NAME}$"; then
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
  log_info "Stopped and removed container $CONTAINER_NAME."
fi

# Fallback: kill any process on 5173
if command -v fuser >/dev/null 2>&1; then
  fuser -k 5173/tcp 2>/dev/null || true
elif command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -t -i:5173 2>/dev/null) && [ -n "$PIDS" ] && echo "$PIDS" | xargs kill 2>/dev/null || true
fi
log_info "Stop complete."
