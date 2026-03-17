#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
APP_PORT=5173
DOCKER_CONTAINER_NAME="saas-dashboard-day17-container"
DOCKER_IMAGE_NAME="saas-dashboard-day17"

# Avoid duplicate: stop any existing process on APP_PORT and existing container
if command -v lsof &>/dev/null; then
  PID=$(lsof -ti :$APP_PORT 2>/dev/null) && kill "$PID" 2>/dev/null || true
fi
docker stop "$DOCKER_CONTAINER_NAME" 2>/dev/null || true
docker rm "$DOCKER_CONTAINER_NAME" 2>/dev/null || true

echo "🚀 Starting dev server at http://localhost:$APP_PORT"
exec npm run dev
