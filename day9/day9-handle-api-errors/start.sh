#!/bin/bash
# Start backend and frontend (run from project root or by full path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}" || exit 1
BACKEND_PORT=3001
FRONTEND_PORT=3000

# Check for duplicate services
if command -v lsof >/dev/null 2>&1; then
  if lsof -Pi :$BACKEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Warning: Backend port $BACKEND_PORT already in use. Run ./stop.sh first."
    exit 1
  fi
  if lsof -Pi :$FRONTEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Warning: Frontend port $FRONTEND_PORT already in use. Run ./stop.sh first."
    exit 1
  fi
fi

echo "Starting backend..."
nohup node backend/index.js > backend/backend.log 2>&1 &
echo $! > .backend_pid
sleep 3
echo "Starting frontend..."
nohup npm start --prefix frontend > frontend/frontend.log 2>&1 &
echo $! > .frontend_pid
sleep 5
echo "Backend: http://localhost:$BACKEND_PORT (PID $(cat .backend_pid))"
echo "Frontend: http://localhost:$FRONTEND_PORT (PID $(cat .frontend_pid))"
echo "Run ./stop.sh to stop both."
