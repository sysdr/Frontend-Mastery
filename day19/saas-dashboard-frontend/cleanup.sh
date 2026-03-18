#!/bin/bash
# cleanup.sh: Stop dev server, stop/remove project containers, remove unused Docker resources.
# Run from project directory: ./cleanup.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTAINER_NAME="saas-dashboard-frontend-container"
IMAGE_NAME="saas-dashboard-frontend-image"

log_info() { echo -e "\e[32m[INFO]\e[0m $1"; }
log_warn() { echo -e "\e[33m[WARN]\e[0m $1"; }

cd "$SCRIPT_DIR"

# 1. Stop dev server (PID file and port 5173)
if [ -f .dev_server_pid ]; then
  PID=$(cat .dev_server_pid 2>/dev/null)
  if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
    kill "$PID" 2>/dev/null || true
    log_info "Stopped dev server (PID $PID)."
  fi
  rm -f .dev_server_pid
fi
if command -v fuser >/dev/null 2>&1; then
  fuser -k 5173/tcp 2>/dev/null || true
elif command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -t -i:5173 2>/dev/null)
  [ -n "$PIDS" ] && echo "$PIDS" | xargs kill 2>/dev/null || true
fi
rm -f .docker_container_id .app.pid

# 2. Stop and remove this project's container
if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -q "^${CONTAINER_NAME}$"; then
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
  log_info "Stopped and removed container: $CONTAINER_NAME"
fi

# 3. Remove this project's image (optional)
if docker images --format '{{.Repository}}' 2>/dev/null | grep -q "^${IMAGE_NAME}$"; then
  docker rmi "$IMAGE_NAME" 2>/dev/null || true
  log_info "Removed image: $IMAGE_NAME"
fi

# 4. Remove unused Docker resources (containers, images, networks)
log_info "Pruning unused Docker resources..."
docker container prune -f 2>/dev/null || true
docker image prune -f 2>/dev/null || true
docker network prune -f 2>/dev/null || true
# Uncomment for full system prune (removes all unused data):
# docker system prune -af 2>/dev/null || true

# 5. Remove local build artifacts (optional, so git status is clean)
rm -rf dist build 2>/dev/null || true
log_info "Removed dist/ and build/ (if present)."

log_info "Cleanup complete."
