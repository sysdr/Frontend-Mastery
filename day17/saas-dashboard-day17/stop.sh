#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
APP_PORT=5173
DOCKER_CONTAINER_NAME="saas-dashboard-day17-container"
DOCKER_IMAGE_NAME="saas-dashboard-day17"

echo "Stopping dev server on port $APP_PORT..."
if command -v lsof &>/dev/null; then
  PID=$(lsof -ti :$APP_PORT 2>/dev/null) && kill "$PID" 2>/dev/null && echo "Stopped process on port $APP_PORT" || true
fi
echo "Stopping Docker container (if running)..."
docker stop "$DOCKER_CONTAINER_NAME" 2>/dev/null || true
docker rm "$DOCKER_CONTAINER_NAME" 2>/dev/null || true
echo "✅ Stop complete."
