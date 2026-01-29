#!/bin/bash
# Cleanup script: stop project containers and remove unused Docker resources.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Stopping project containers..."
docker stop dashboard-day11-container 2>/dev/null || true
docker rm dashboard-day11-container 2>/dev/null || true

echo "Stopping any process on port 3000..."
lsof -ti tcp:3000 2>/dev/null | xargs -r kill -9 2>/dev/null || true
rm -f .local_run_pid

echo "Removing unused Docker resources (containers, images, volumes, networks)..."
docker system prune -af --volumes 2>/dev/null || true

echo "Cleanup complete."
