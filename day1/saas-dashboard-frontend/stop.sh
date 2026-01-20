#!/bin/bash

# Stop script for saas-dashboard-frontend

PROJECT_NAME="saas-dashboard-frontend"
DOCKER_CONTAINER_NAME="saas-dashboard-frontend-container"

print_info() {
  echo -e "\n\033[1;34m[INFO]\033[0m $1"
}

print_success() {
  echo -e "\n\033[1;32m[SUCCESS]\033[0m $1"
}

print_warning() {
  echo -e "\n\033[1;33m[WARNING]\033[0m $1"
}

# Determine the correct path for .vite_pid
if [ -f ".vite_pid" ]; then
  VITE_PID_FILE=".vite_pid"
elif [ -f "$PROJECT_NAME/.vite_pid" ]; then
  VITE_PID_FILE="$PROJECT_NAME/.vite_pid"
else
  VITE_PID_FILE=""
fi

# Stop Vite dev server
if [ -n "$VITE_PID_FILE" ] && [ -f "$VITE_PID_FILE" ]; then
  VITE_PID=$(cat "$VITE_PID_FILE")
  if kill -0 "$VITE_PID" 2>/dev/null; then
    print_info "Stopping Vite dev server (PID: $VITE_PID)..."
    # Kill the process and its children
    pkill -P "$VITE_PID" 2>/dev/null
    kill "$VITE_PID" 2>/dev/null
    sleep 1
    if ! kill -0 "$VITE_PID" 2>/dev/null; then
      print_success "Vite dev server stopped."
    else
      print_warning "Force killing Vite dev server..."
      pkill -9 -P "$VITE_PID" 2>/dev/null
      kill -9 "$VITE_PID" 2>/dev/null
    fi
  else
    print_warning "Vite dev server process not found (PID: $VITE_PID)"
  fi
  rm -f "$VITE_PID_FILE"
fi

# Kill any remaining Vite processes on port 5173
print_info "Checking for any remaining Vite processes..."
if pkill -f "vite.*5173" 2>/dev/null; then
  sleep 1
  print_success "Killed remaining Vite processes."
elif pgrep -f "vite.*5173" >/dev/null 2>&1; then
  print_warning "Some Vite processes may still be running."
else
  print_success "No Vite processes found."
fi

# Stop Docker container if it exists
if command -v docker >/dev/null 2>&1; then
  if docker ps -a --format '{{.Names}}' | grep -q "^${DOCKER_CONTAINER_NAME}$"; then
    print_info "Stopping Docker container: $DOCKER_CONTAINER_NAME"
    docker stop "$DOCKER_CONTAINER_NAME" 2>/dev/null && print_success "Docker container stopped."
    docker rm "$DOCKER_CONTAINER_NAME" 2>/dev/null && print_success "Docker container removed."
  fi
fi

print_success "Cleanup complete."
