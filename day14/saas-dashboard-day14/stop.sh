#!/bin/bash
# stop.sh: Stops the React application and cleans up Docker resources

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_IMAGE_NAME="saas-dashboard-day14-app"
DOCKER_CONTAINER_NAME="saas-dashboard-day14-container"
PORT=3000

log_info() {
  echo -e "\n\e[1;34m[INFO]\e[0m $1"
}

log_success() {
  echo -e "\n\e[1;32m[SUCCESS]\e[0m $1"
}

log_warn() {
  echo -e "\n\e[1;33m[WARNING]\e[0m $1"
}

cd "$PROJECT_DIR"

log_info "Stopping Day 14 application..."

# Stop the local React app if running
if [ -f ".app.pid" ]; then
  PID=$(cat .app.pid)
  if kill -0 "$PID" 2>/dev/null; then
    log_info "Stopping local application (PID: $PID)..."
    kill "$PID" 2>/dev/null || true
    rm -f .app.pid
    log_success "Local application stopped."
  else
    log_warn "Process $PID not found. May have already stopped."
    rm -f .app.pid
  fi
else
  log_warn "No .app.pid file found."
fi

# Kill any process on port 3000
if lsof -i :$PORT > /dev/null 2>&1; then
  log_info "Killing processes on port $PORT..."
  fuser -k $PORT/tcp 2>/dev/null || true
  log_success "Port $PORT cleared."
fi

# Stop Docker container if running
if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -q "^${DOCKER_CONTAINER_NAME}$"; then
  log_info "Stopping Docker container: $DOCKER_CONTAINER_NAME"
  docker stop "$DOCKER_CONTAINER_NAME" > /dev/null 2>&1 || true
  docker rm "$DOCKER_CONTAINER_NAME" > /dev/null 2>&1 || true
  log_success "Docker container stopped and removed."
else
  log_warn "Docker container $DOCKER_CONTAINER_NAME not found."
fi

# Remove Docker image
if docker images -q "$DOCKER_IMAGE_NAME" 2>/dev/null | grep -q .; then
  log_info "Removing Docker image: $DOCKER_IMAGE_NAME"
  docker rmi "$DOCKER_IMAGE_NAME" > /dev/null 2>&1 || true
  log_success "Docker image removed."
fi

log_success "Cleanup complete!"
