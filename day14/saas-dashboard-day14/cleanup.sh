#!/bin/bash
# cleanup.sh: Stops all services and removes Docker resources for Day 14 project

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_IMAGE_NAME="saas-dashboard-day14-app"
DOCKER_CONTAINER_NAME="saas-dashboard-day14-container"
PORT=3000

# --- Utility Functions ---
log_info() {
  echo -e "\n\e[1;34m[INFO]\e[0m $1"
}

log_success() {
  echo -e "\n\e[1;32m[SUCCESS]\e[0m $1"
}

log_warn() {
  echo -e "\n\e[1;33m[WARNING]\e[0m $1"
}

log_error() {
  echo -e "\n\e[1;31m[ERROR]\e[0m $1"
}

# --- Main Cleanup ---
log_info "Starting cleanup for Day 14 project..."

cd "$PROJECT_DIR"

# 1. Stop local React app if running
log_info "Stopping local application..."
if [ -f ".app.pid" ]; then
  PID=$(cat .app.pid)
  if kill -0 "$PID" 2>/dev/null; then
    log_info "Stopping local application (PID: $PID)..."
    kill "$PID" 2>/dev/null || true
    sleep 2
    rm -f .app.pid
    log_success "Local application stopped."
  else
    log_warn "Process $PID not found."
    rm -f .app.pid
  fi
fi

# 2. Kill any process on port 3000
if command -v lsof &> /dev/null && lsof -i :$PORT > /dev/null 2>&1; then
  log_info "Killing processes on port $PORT..."
  if command -v fuser &> /dev/null; then
    fuser -k $PORT/tcp 2>/dev/null || true
  else
    kill $(lsof -t -i:$PORT) 2>/dev/null || true
  fi
  log_success "Port $PORT cleared."
fi

# 3. Stop and remove Docker container
log_info "Stopping Docker containers..."
if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -q "^${DOCKER_CONTAINER_NAME}$"; then
  docker stop "$DOCKER_CONTAINER_NAME" > /dev/null 2>&1 || true
  docker rm "$DOCKER_CONTAINER_NAME" > /dev/null 2>&1 || true
  log_success "Container $DOCKER_CONTAINER_NAME stopped and removed."
else
  log_warn "Container $DOCKER_CONTAINER_NAME not found."
fi

# 4. Remove Docker image
log_info "Removing Docker images..."
if docker images -q "$DOCKER_IMAGE_NAME" 2>/dev/null | grep -q .; then
  docker rmi "$DOCKER_IMAGE_NAME" > /dev/null 2>&1 || true
  log_success "Image $DOCKER_IMAGE_NAME removed."
else
  log_warn "Image $DOCKER_IMAGE_NAME not found."
fi

# 5. Remove dangling images and volumes
log_info "Removing unused Docker resources..."
docker system prune -f > /dev/null 2>&1 || log_warn "Could not prune Docker resources."
docker volume prune -f > /dev/null 2>&1 || log_warn "Could not prune Docker volumes."
log_success "Unused Docker resources removed."

# 6. Remove build artifacts
log_info "Removing build artifacts..."
rm -rf "$PROJECT_DIR/build" 2>/dev/null || true
rm -rf "$PROJECT_DIR/coverage" 2>/dev/null || true
rm -f "$PROJECT_DIR/.app.pid" 2>/dev/null || true
log_success "Build artifacts removed."

# 7. Remove node_modules (optional - uncomment if needed)
# log_info "Removing node_modules..."
# rm -rf "$PROJECT_DIR/node_modules" 2>/dev/null || true
# log_success "node_modules removed."

# 8. Remove Python cache files (if any)
log_info "Removing Python cache files..."
find "$PROJECT_DIR" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find "$PROJECT_DIR" -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
find "$PROJECT_DIR" -type f -name "*.pyc" -delete 2>/dev/null || true
find "$PROJECT_DIR" -type d -name "venv" -exec rm -rf {} + 2>/dev/null || true
find "$PROJECT_DIR" -type d -name ".venv" -exec rm -rf {} + 2>/dev/null || true
log_success "Python cache files removed."

# 9. Remove Istio files (if any)
log_info "Removing Istio files..."
find "$PROJECT_DIR" -name "*istio*" -exec rm -rf {} + 2>/dev/null || true
find "$PROJECT_DIR" -name "*Istio*" -exec rm -rf {} + 2>/dev/null || true
log_success "Istio files removed."

# 10. Summary
log_success "=== Cleanup Complete ==="
echo ""
echo "Removed:"
echo "  - Local application processes"
echo "  - Docker containers"
echo "  - Docker images"
echo "  - Unused Docker resources and volumes"
echo "  - Build artifacts (build/, coverage/)"
echo "  - Python cache files"
echo "  - Istio files"
echo ""
echo "To reinstall dependencies, run: npm install"
