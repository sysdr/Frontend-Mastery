#!/bin/bash
# Stop app dev server, Docker containers, and remove unused Docker resources.
# Run from project root (saas-dashboard-day20) or with full path.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Stopping dev server ==="
PID_FILE="$SCRIPT_DIR/dashboard-app/.dev-server.pid"
if [ -f "$PID_FILE" ]; then
  kill "$(cat "$PID_FILE")" 2>/dev/null && echo "Stopped dev server." || true
  rm -f "$PID_FILE"
fi
pkill -f "vite.*dashboard-app" 2>/dev/null || true
echo "Dev server stopped (if it was running)."

echo ""
echo "=== Stopping Docker containers ==="
if command -v docker &>/dev/null; then
  CONTAINERS=$(docker ps -aq 2>/dev/null)
  if [ -n "$CONTAINERS" ]; then
    docker stop $CONTAINERS 2>/dev/null || true
    docker rm $CONTAINERS 2>/dev/null || true
    echo "Stopped and removed containers."
  else
    echo "No Docker containers to stop."
  fi

  echo ""
  echo "=== Removing unused Docker resources ==="
  docker system prune -af --volumes 2>/dev/null || docker system prune -af 2>/dev/null || true
  echo "Docker cleanup done."
else
  echo "Docker not found; skipping Docker cleanup."
fi

echo ""
echo "=== Cleanup complete ==="
