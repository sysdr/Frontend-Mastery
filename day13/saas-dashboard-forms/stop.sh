#!/bin/bash

# --- Configuration ---
PROJECT_NAME="saas-dashboard-forms"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# --- Helper Functions ---
log_info() {
  echo -e "\e[32m[INFO] $1\e[0m"
}

log_warn() {
  echo -e "\e[33m[WARN] $1\e[0m"
}

log_error() {
  echo -e "\e[31m[ERROR] $1\e[0m"
}

# --- Stop Local Process ---
stop_local() {
  if [ -f "$SCRIPT_DIR/.npm_pid" ]; then
    NPM_PID=$(cat "$SCRIPT_DIR/.npm_pid")
    if ps -p $NPM_PID > /dev/null 2>&1; then
      log_info "Stopping local Vite development server (PID: $NPM_PID)..."
      kill $NPM_PID 2>/dev/null
      rm "$SCRIPT_DIR/.npm_pid"
      log_info "Local server stopped."
    else
      log_warn "No local Vite development server found running with PID $NPM_PID. Removing stale .npm_pid file."
      rm "$SCRIPT_DIR/.npm_pid"
    fi
  else
    log_warn "No .npm_pid file found for local server. Checking for running processes on port 3000..."
    # Try to find and kill any process on port 3000
    PID=$(lsof -t -i:3000 2>/dev/null || netstat -tlnp 2>/dev/null | grep :3000 | awk '{print $7}' | cut -d'/' -f1)
    if [ -n "$PID" ]; then
      log_info "Found process on port 3000 (PID: $PID). Stopping..."
      kill $PID 2>/dev/null
      log_info "Process stopped."
    else
      log_info "No running process found on port 3000."
    fi
  fi
}

# --- Stop Docker Container ---
stop_docker() {
  log_info "Checking for running Docker container '$PROJECT_NAME-container'..."
  if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -q "$PROJECT_NAME-container"; then
    log_info "Stopping Docker container '$PROJECT_NAME-container'..."
    docker stop "$PROJECT_NAME-container" 2>/dev/null || log_error "Failed to stop Docker container."
    log_info "Removing Docker container '$PROJECT_NAME-container'..."
    docker rm "$PROJECT_NAME-container" 2>/dev/null || log_error "Failed to remove Docker container."
    log_info "Container '$PROJECT_NAME-container' stopped and removed."
  else
    log_info "Docker container '$PROJECT_NAME-container' is not running or does not exist."
  fi
}

# --- Main Logic ---
main() {
  echo "--- Stopping Day 13 Project ---"
  echo ""

  stop_local
  stop_docker

  log_info "Cleanup complete."
}

main
