#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
APP_PORT=5173
PID_FILE="$SCRIPT_DIR/.frontend_dev_server.pid"
LOG_FILE="$SCRIPT_DIR/frontend_dev_server.log"

# Check for duplicate: process already on APP_PORT
if command -v lsof &>/dev/null; then
  EXISTING_PID=$(lsof -ti :$APP_PORT 2>/dev/null) || true
  if [ -n "$EXISTING_PID" ]; then
    echo "Port $APP_PORT already in use (PID $EXISTING_PID). Stopping existing process..."
    kill $EXISTING_PID 2>/dev/null || true
    sleep 2
  fi
fi
# If we have a stale PID file, try to clean it (do not fail if process already gone)
if [ -f "$PID_FILE" ]; then
  kill "$(cat "$PID_FILE")" 2>/dev/null || true
  rm -f "$PID_FILE"
fi

echo "Starting dev server at http://localhost:$APP_PORT ..."
npm run dev > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"
echo "Dev server started (PID $(cat "$PID_FILE")). Logs: $LOG_FILE"
echo "Dashboard: http://localhost:$APP_PORT — To stop: $SCRIPT_DIR/stop.sh"
