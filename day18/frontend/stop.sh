#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
APP_PORT=5173
PID_FILE="$SCRIPT_DIR/.frontend_dev_server.pid"

echo "Stopping dev server on port $APP_PORT..."
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  kill "$PID" 2>/dev/null && echo "Stopped process (PID $PID)" || true
  rm -f "$PID_FILE"
fi
if command -v lsof &>/dev/null; then
  EXISTING_PID=$(lsof -ti :$APP_PORT 2>/dev/null) || true
  [ -n "$EXISTING_PID" ] && kill $EXISTING_PID 2>/dev/null && echo "Stopped process on port $APP_PORT" || true
fi
echo "Stop complete."
