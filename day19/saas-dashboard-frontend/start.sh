#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=5173
CONTAINER_NAME="saas-dashboard-frontend-container"

log_info() { echo -e "\e[32m[INFO]\e[0m $1"; }
log_warn() { echo -e "\e[33m[WARN]\e[0m $1"; }
log_error() { echo -e "\e[31m[ERROR]\e[0m $1" >&2; exit 1; }

cd "$SCRIPT_DIR"

# Check for duplicate services on port
if command -v lsof >/dev/null 2>&1; then
  if lsof -i :$PORT >/dev/null 2>&1; then
    log_warn "Port $PORT already in use. Run ./stop.sh first or use: kill \$(lsof -t -i:$PORT)"
    exit 1
  fi
elif command -v ss >/dev/null 2>&1; then
  if ss -tuln | grep -q ":$PORT "; then
    log_warn "Port $PORT already in use. Run ./stop.sh first."
    exit 1
  fi
fi

# Stop existing Docker container if present
if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -q "^${CONTAINER_NAME}$"; then
  log_info "Stopping existing container $CONTAINER_NAME..."
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
fi

if [ ! -d "node_modules" ]; then
  log_info "Installing dependencies..."
  npm install || log_error "Failed to install dependencies."
fi

log_info "Starting development server at http://localhost:$PORT"
npm run dev &
DEV_PID=$!
echo $DEV_PID > .dev_server_pid
log_info "PID $DEV_PID saved to .dev_server_pid. To stop: $SCRIPT_DIR/stop.sh"
log_info "Dashboard: http://localhost:$PORT"
wait $DEV_PID
