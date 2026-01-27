#!/bin/bash

# Get the directory where this script is located (project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="5173"

cd "${SCRIPT_DIR}" || exit 1

echo "Stopping Vite development server..."

# Check for PID file
if [ -f .vite_pid ]; then
  VITE_PID=$(cat .vite_pid)
  if ps -p ${VITE_PID} > /dev/null 2>&1; then
    kill ${VITE_PID}
    echo "Stopped process ${VITE_PID}"
    rm .vite_pid
  else
    echo "Process ${VITE_PID} not found"
    rm .vite_pid
  fi
fi

# Also check for any remaining Vite processes
if pgrep -f "vite" > /dev/null; then
  echo "Stopping remaining Vite processes..."
  pkill -f "vite"
fi

# Check if port is still in use
if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "Warning: Port ${PORT} is still in use. You may need to manually stop the process."
else
  echo "✓ Server stopped successfully"
fi
