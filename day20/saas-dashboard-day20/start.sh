#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/dashboard-app" || exit 1
if [ -f .dev-server.pid ]; then
  kill "$(cat .dev-server.pid)" 2>/dev/null || true
  rm -f .dev-server.pid
fi
npm run dev &
echo $! > .dev-server.pid
echo "Dev server started (PID in dashboard-app/.dev-server.pid). Press Ctrl+C to stop."
wait
