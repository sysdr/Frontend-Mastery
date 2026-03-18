#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$SCRIPT_DIR/dashboard-app/.dev-server.pid"
if [ -f "$PID_FILE" ]; then
  kill "$(cat "$PID_FILE")" 2>/dev/null && echo "Stopped dev server." || echo "Process already stopped."
  rm -f "$PID_FILE"
else
  pkill -f "vite.*dashboard-app" 2>/dev/null && echo "Stopped dev server." || echo "No dev server found."
fi
