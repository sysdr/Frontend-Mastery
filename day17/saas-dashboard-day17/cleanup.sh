#!/bin/bash
# Stop app, stop/remove project containers and images, then prune unused Docker resources.
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
APP_PORT=5173
DOCKER_CONTAINER_NAME="saas-dashboard-day17-container"
DOCKER_IMAGE_NAME="saas-dashboard-day17"

echo "🧹 Cleanup: stopping app and Docker resources..."

# Stop dev server on APP_PORT
echo "Stopping dev server on port $APP_PORT..."
if command -v lsof &>/dev/null; then
  PID=$(lsof -ti :$APP_PORT 2>/dev/null) && kill "$PID" 2>/dev/null && echo "  Stopped process on port $APP_PORT" || true
fi

# Stop and remove project container
echo "Stopping and removing container: $DOCKER_CONTAINER_NAME..."
docker stop "$DOCKER_CONTAINER_NAME" 2>/dev/null || true
docker rm "$DOCKER_CONTAINER_NAME" 2>/dev/null || true

# Remove project image
echo "Removing image: $DOCKER_IMAGE_NAME..."
docker rmi "$DOCKER_IMAGE_NAME" 2>/dev/null || true

# Prune stopped containers
echo "Removing unused containers..."
docker container prune -f

# Prune dangling images
echo "Removing dangling images..."
docker image prune -f

# Optional: prune unused build cache (uncomment if desired)
# docker builder prune -f

echo "✅ Cleanup complete."
