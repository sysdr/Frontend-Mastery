#!/bin/bash
# Cleanup: stop containers, prune Docker, remove generated/cache dirs from project.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

APP_PORT=3000
API_PORT=3001

echo "=== Stopping local processes ==="
lsof -ti tcp:$APP_PORT | xargs -r kill -9 2>/dev/null || true
lsof -ti tcp:$API_PORT | xargs -r kill -9 2>/dev/null || true

echo "=== Stopping Docker containers ==="
docker stop saas-frontend-day10 2>/dev/null || true
docker rm saas-frontend-day10 2>/dev/null || true
docker stop saas-api-day10 2>/dev/null || true
docker rm saas-api-day10 2>/dev/null || true
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

echo "=== Removing unused Docker resources (containers, images, volumes, networks) ==="
docker system prune -af --volumes

echo "=== Removing from project: node_modules, venv, .pytest_cache, .pyc, Istio, .next ==="
rm -rf "$SCRIPT_DIR/node_modules"
rm -rf "$SCRIPT_DIR/api/node_modules"
rm -rf "$SCRIPT_DIR/.next"
rm -rf "$SCRIPT_DIR/venv"
find "$SCRIPT_DIR" -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
find "$SCRIPT_DIR" -type f -name "*.pyc" -delete 2>/dev/null || true
find "$SCRIPT_DIR" -type d -name "*istio*" -exec rm -rf {} + 2>/dev/null || true
find "$SCRIPT_DIR" -type f -name "*istio*" -delete 2>/dev/null || true

echo "Cleanup done. Re-run setup.sh or npm install to restore dependencies."
