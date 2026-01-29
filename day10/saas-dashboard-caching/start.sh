#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
API_PORT=3001
APP_PORT=3000

# Check for existing processes on ports
if lsof -ti tcp:$API_PORT >/dev/null 2>&1; then
  echo "Port $API_PORT already in use. Stopping existing process..."
  lsof -ti tcp:$API_PORT | xargs kill -9 2>/dev/null || true
  sleep 1
fi
if lsof -ti tcp:$APP_PORT >/dev/null 2>&1; then
  echo "Port $APP_PORT already in use. Stopping existing process..."
  lsof -ti tcp:$APP_PORT | xargs kill -9 2>/dev/null || true
  sleep 1
fi

echo "Starting API server on port $API_PORT..."
(cd "$SCRIPT_DIR/api" && node server.js) &
API_PID=$!
echo "API server PID: $API_PID"

echo "Starting Next.js dev server on port $APP_PORT..."
(cd "$SCRIPT_DIR" && npm run dev) &
NEXT_PID=$!
echo "Next.js PID: $NEXT_PID"

echo "Waiting for servers to be ready..."
sleep 5
echo "Dashboard: http://localhost:$APP_PORT"
echo "API: http://localhost:$API_PORT/api/metrics"
echo "Press Ctrl+C to stop."
wait
