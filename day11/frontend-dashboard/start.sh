#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
PORT=3000

if lsof -ti tcp:$PORT >/dev/null 2>&1; then
  echo "Port $PORT already in use. Stopping existing process (avoid duplicate)..."
  lsof -ti tcp:$PORT | xargs kill -9 2>/dev/null || true
  sleep 2
fi

echo "Starting React app on http://localhost:$PORT ..."
npm start &
echo $! > .local_run_pid
sleep 5
echo "Dashboard: http://localhost:$PORT"
echo "Run ./stop.sh to stop."
wait
