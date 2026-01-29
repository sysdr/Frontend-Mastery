#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
PORT=3000

echo "Stopping Day 11 processes on port $PORT..."
lsof -ti tcp:$PORT | xargs -r kill -9 2>/dev/null || true
docker stop dashboard-day11-container 2>/dev/null || true
docker rm dashboard-day11-container 2>/dev/null || true
rm -f .local_run_pid
echo "Stopped."
