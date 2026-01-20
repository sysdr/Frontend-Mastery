#!/bin/bash

# Start script for saas-dashboard-frontend

PROJECT_NAME="saas-dashboard-frontend"
VITE_PORT=5173

print_info() {
  echo -e "\n\033[1;34m[INFO]\033[0m $1"
}

print_success() {
  echo -e "\n\033[1;32m[SUCCESS]\033[0m $1"
}

print_error() {
  echo -e "\n\033[1;31m[ERROR]\033[0m $1"
  exit 1
}

print_warning() {
  echo -e "\n\033[1;33m[WARNING]\033[0m $1"
}

# Check if we're already in the project directory (check for package.json)
if [ -f "package.json" ]; then
  print_info "Already in project directory"
else
  # Check if project directory exists
  if [ ! -d "$PROJECT_NAME" ]; then
    print_error "Project directory '$PROJECT_NAME' not found. Please run setup.sh first."
  fi
  
  # Navigate to project directory
  cd "$PROJECT_NAME" || print_error "Failed to navigate to $PROJECT_NAME"
fi

# Check if already running
if [ -f ".vite_pid" ]; then
  OLD_PID=$(cat .vite_pid)
  if kill -0 "$OLD_PID" 2>/dev/null; then
    print_warning "Vite dev server is already running (PID: $OLD_PID)"
    print_info "Access it at: http://localhost:$VITE_PORT"
    exit 0
  else
    rm -f .vite_pid
  fi
fi

# Check if port is already in use
if command -v ss >/dev/null 2>&1; then
  if ss -tlnp 2>/dev/null | grep -q ":$VITE_PORT "; then
    print_warning "Port $VITE_PORT is already in use. Checking for existing Vite process..."
    EXISTING_PID=$(lsof -ti:$VITE_PORT 2>/dev/null || fuser $VITE_PORT/tcp 2>/dev/null | awk '{print $1}' || echo "")
    if [ -n "$EXISTING_PID" ]; then
      print_warning "Found process using port $VITE_PORT (PID: $EXISTING_PID)"
      print_info "Access it at: http://localhost:$VITE_PORT"
      exit 0
    fi
  fi
fi

# Start the development server
print_info "Starting Vite development server..."
npm run dev -- --port $VITE_PORT > vite.log 2>&1 &
VITE_PID=$!
echo "$VITE_PID" > .vite_pid

print_info "Vite development server starting on http://localhost:$VITE_PORT (PID: $VITE_PID)"
print_info "Waiting for server to be ready..."

# Wait for server to be ready
MAX_ATTEMPTS=30
ATTEMPT=0
SERVER_READY=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  sleep 2
  ATTEMPT=$((ATTEMPT + 1))
  
  if curl -s -f "http://localhost:$VITE_PORT" > /dev/null 2>&1; then
    SERVER_READY=1
    break
  fi
  
  if ! kill -0 $VITE_PID 2>/dev/null; then
    print_error "Vite server process died. Check vite.log for errors: $(tail -20 vite.log 2>/dev/null || echo 'Log file not found')"
  fi
done

if [ $SERVER_READY -eq 1 ]; then
  print_success "Vite development server is running!"
  print_info "You can access the application at: \033[1;36mhttp://localhost:$VITE_PORT\033[0m"
  print_info "Press Ctrl+C to stop this script, but the server will continue running."
  print_info "Use 'stop.sh' to stop the server."
else
  print_error "Server did not become ready after $((MAX_ATTEMPTS * 2)) seconds. Check vite.log: $(tail -30 vite.log 2>/dev/null || echo 'Log file not found')"
fi
