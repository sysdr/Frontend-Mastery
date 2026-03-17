#!/bin/bash
# cleanup.sh: Stop dev server, stop/remove project containers, remove unused Docker resources

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

APP_PORT=5173
PID_FILE="$SCRIPT_DIR/.frontend_dev_server.pid"
CONTAINER_NAME="saas-dashboard-container"
IMAGE_NAME="saas-dashboard-frontend"

echo "=== Stopping dev server on port $APP_PORT ==="
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  kill "$PID" 2>/dev/null && echo "Stopped process (PID $PID)" || true
  rm -f "$PID_FILE"
fi
if command -v lsof &>/dev/null; then
  EXISTING_PID=$(lsof -ti :$APP_PORT 2>/dev/null) || true
  if [ -n "$EXISTING_PID" ]; then
    kill $EXISTING_PID 2>/dev/null && echo "Stopped process on port $APP_PORT" || true
  fi
fi
echo "Dev server stopped."

echo ""
echo "=== Stopping and removing Docker containers (this project) ==="
if command -v docker &>/dev/null; then
  docker stop "$CONTAINER_NAME" 2>/dev/null && echo "Stopped container: $CONTAINER_NAME" || true
  docker rm "$CONTAINER_NAME" 2>/dev/null && echo "Removed container: $CONTAINER_NAME" || true

  echo ""
  echo "=== Removing project Docker image ==="
  docker rmi "$IMAGE_NAME" 2>/dev/null && echo "Removed image: $IMAGE_NAME" || true

  echo ""
  echo "=== Removing unused Docker resources (containers, images, networks) ==="
  docker system prune -f
  echo "Docker cleanup done."
else
  echo "Docker not found or not running. Skipping Docker cleanup."
fi

echo ""
echo "=== Removing local build artifacts and runtime files ==="
rm -f "$SCRIPT_DIR/.frontend_dev_server.pid"
rm -f "$SCRIPT_DIR/frontend_dev_server.log"
rm -rf "$SCRIPT_DIR/dist"
echo "Cleanup complete."
