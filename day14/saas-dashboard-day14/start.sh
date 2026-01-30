#!/bin/bash
# start.sh: Builds and runs the React application

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=3000
DOCKER_IMAGE_NAME="saas-dashboard-day14-app"
DOCKER_CONTAINER_NAME="saas-dashboard-day14-container"

log_info() {
  echo -e "\n\e[1;34m[INFO]\e[0m $1"
}

log_success() {
  echo -e "\n\e[1;32m[SUCCESS]\e[0m $1"
}

log_error() {
  echo -e "\n\e[1;31m[ERROR]\e[0m $1" >&2
  exit 1
}

wait_for_server() {
  local url=$1
  local timeout=120
  local start_time=$(date +%s)
  log_info "Waiting for server at $url to be ready..."
  while ! curl -s $url > /dev/null; do
    sleep 2
    current_time=$(date +%s)
    if (( current_time - start_time > timeout )); then
      log_error "Server at $url did not become ready within $timeout seconds."
    fi
    echo -n "."
  done
  echo ""
  log_success "Server at $url is ready."
}

check_duplicate_services() {
  log_info "Checking for duplicate services..."
  
  # Check if port 3000 is already in use
  if lsof -i :$PORT > /dev/null 2>&1; then
    log_info "Port $PORT is already in use. Killing existing process..."
    fuser -k $PORT/tcp 2>/dev/null || true
    sleep 2
  fi
  
  # Check for existing Docker container
  if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -q "^${DOCKER_CONTAINER_NAME}$"; then
    log_info "Found existing Docker container. Stopping it..."
    docker stop "$DOCKER_CONTAINER_NAME" > /dev/null 2>&1 || true
    docker rm "$DOCKER_CONTAINER_NAME" > /dev/null 2>&1 || true
  fi
  
  log_success "No duplicate services running."
}

cd "$PROJECT_DIR"

# Check for duplicate services
check_duplicate_services

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  log_info "Installing dependencies..."
  npm install || log_error "Failed to install dependencies."
fi

log_info "Building the project..."
npm run build || log_error "Build failed."
log_success "Project built successfully."

log_info "Starting the application on port $PORT..."
npm start &
APP_PID=$!

# Save PID to file for stop.sh
echo $APP_PID > .app.pid

wait_for_server "http://localhost:$PORT"

log_success "Application is running at http://localhost:$PORT"
log_info "PID: $APP_PID (saved to .app.pid)"
echo ""
echo "To stop the application, run: ./stop.sh"
