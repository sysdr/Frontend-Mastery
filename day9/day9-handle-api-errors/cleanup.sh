#!/bin/bash
# Cleanup script: stop containers and remove unused Docker resources (volumes, containers, images).
# Run from this project directory (day9-handle-api-errors).

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Stopping application services (if running) ==="
if [ -f "$SCRIPT_DIR/stop.sh" ]; then
    "$SCRIPT_DIR/stop.sh" 2>/dev/null || true
fi
# Kill any process on frontend/backend ports
for port in 3000 3001; do
    pids=$(lsof -ti :$port 2>/dev/null) || true
    [ -n "$pids" ] && kill $pids 2>/dev/null || true
done
echo "Application services stopped."

echo "=== Stopping Docker Compose (this project) ==="
if [ -f "$SCRIPT_DIR/docker-compose.yml" ]; then
    docker compose -f "$SCRIPT_DIR/docker-compose.yml" down -v 2>/dev/null || true
fi
echo "=== Stopping all running containers ==="
docker stop $(docker ps -q) 2>/dev/null || true

echo "=== Removing unused Docker resources ==="
docker system prune -a -f --volumes
echo "Docker cleanup complete."

echo "=== Cleanup finished ==="
