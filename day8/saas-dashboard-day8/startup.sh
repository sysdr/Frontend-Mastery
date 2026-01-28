#!/bin/bash

# Startup script for SaaS Dashboard Day 8
# This script starts the preview server and checks for duplicate services

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Function to display messages
log_info() {
  echo -e "\e[32m[INFO]\e[0m $1"
}

log_warn() {
  echo -e "\e[33m[WARN]\e[0m $1"
}

log_error() {
  echo -e "\e[31m[ERROR]\e[0m $1"
}

# Check if preview server is already running
check_running_services() {
  log_info "Checking for running services..."
  
  # Check for vite preview processes
  VITE_PIDS=$(pgrep -f "vite preview" || true)
  if [ -n "$VITE_PIDS" ]; then
    log_warn "Found existing Vite preview processes: $VITE_PIDS"
    log_warn "Killing existing processes..."
    pkill -f "vite preview" || true
    sleep 2
  fi
  
  # Check for processes on common ports (4173, 5173)
  PORT_4173=$(lsof -ti:4173 2>/dev/null || true)
  PORT_5173=$(lsof -ti:5173 2>/dev/null || true)
  
  if [ -n "$PORT_4173" ]; then
    log_warn "Port 4173 is in use by PID: $PORT_4173"
    log_warn "Killing process on port 4173..."
    kill -9 $PORT_4173 2>/dev/null || true
    sleep 1
  fi
  
  if [ -n "$PORT_5173" ]; then
    log_warn "Port 5173 is in use by PID: $PORT_5173"
    log_warn "Killing process on port 5173..."
    kill -9 $PORT_5173 2>/dev/null || true
    sleep 1
  fi
  
  log_info "Service check complete."
}

# Check if build exists
if [ ! -d "dist" ]; then
  log_error "Build directory not found. Please run 'npm run build' first."
  exit 1
fi

# Check for duplicate services
check_running_services

# Start the preview server
log_info "Starting SaaS Dashboard preview server..."
log_info "The dashboard will be available at http://localhost:4173"
log_info "Press Ctrl+C to stop the server"

npm run preview
