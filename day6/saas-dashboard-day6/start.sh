#!/bin/bash
# Start backend and frontend (run from project root or by full path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}" || exit 1
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Check for duplicate services
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "Warning: Backend port 3001 already in use. Stopping existing..."
  pkill -f "node.*server\.js" 2>/dev/null || true
  sleep 2
fi
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "Warning: Frontend port 5173 already in use. Stopping existing..."
  pkill -f "vite" 2>/dev/null || true
  sleep 2
fi

echo "Starting backend..."
(cd "$BACKEND_DIR" && npm start) &
BACKEND_PID=$!
echo "$BACKEND_PID" > "$SCRIPT_DIR/.backend_pid"
sleep 3
echo "Starting frontend..."
(cd "$FRONTEND_DIR" && npm run dev) &
FRONTEND_PID=$!
echo "$FRONTEND_PID" > "$SCRIPT_DIR/.frontend_pid"
sleep 4
echo "Backend: http://localhost:3001 (PID $BACKEND_PID)"
echo "Frontend: http://localhost:5173 (PID $FRONTEND_PID)"
echo "Run stop.sh to stop both."

