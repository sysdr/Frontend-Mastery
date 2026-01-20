#!/bin/bash
# Stop script for SaaS Dashboard
# This script stops all running services related to the dashboard

APP_PORT=3000
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Stopping SaaS Dashboard services..."

# Function to kill processes by port
kill_by_port() {
  local port=$1
  if command -v lsof >/dev/null 2>&1; then
    local pids=$(lsof -ti :${port} 2>/dev/null)
    if [ -n "$pids" ]; then
      echo "Found processes on port ${port}: $pids"
      echo "$pids" | xargs kill -9 2>/dev/null || true
      echo "Killed processes on port ${port}"
    else
      echo "No processes found on port ${port}"
    fi
  else
    echo "Warning: lsof not available, trying alternative method..."
    # Alternative: use fuser if available
    if command -v fuser >/dev/null 2>&1; then
      fuser -k ${port}/tcp 2>/dev/null || true
    fi
  fi
}

# Function to kill processes by pattern
kill_by_pattern() {
  local pattern=$1
  local name=$2
  local pids=$(ps aux | grep -E "$pattern" | grep -v grep | awk '{print $2}')
  if [ -n "$pids" ]; then
    echo "Found $name processes: $pids"
    echo "$pids" | xargs kill -9 2>/dev/null || true
    echo "Killed $name processes"
  else
    echo "No $name processes found"
  fi
}

# Stop processes on the app port
kill_by_port ${APP_PORT}

# Stop react-scripts processes
kill_by_pattern "react-scripts start" "react-scripts"

# Stop npm start processes (but be careful not to kill all npm processes)
pids=$(ps aux | grep -E "npm.*start.*saas-dashboard|npm.*start.*${SCRIPT_DIR}" | grep -v grep | awk '{print $2}')
if [ -n "$pids" ]; then
  echo "Found npm start processes for dashboard: $pids"
  echo "$pids" | xargs kill -9 2>/dev/null || true
  echo "Killed npm start processes"
else
  echo "No npm start processes found for dashboard"
fi

# Wait a moment for processes to terminate
sleep 1

# Verify everything is stopped
if command -v lsof >/dev/null 2>&1; then
  if lsof -Pi :${APP_PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Warning: Port ${APP_PORT} is still in use. Some processes may not have stopped."
  else
    echo "✓ Port ${APP_PORT} is now free"
  fi
fi

# Check for remaining processes
remaining=$(ps aux | grep -E "node.*react-scripts.*saas-dashboard|npm.*start.*saas-dashboard" | grep -v grep | wc -l)
if [ "$remaining" -gt 0 ]; then
  echo "Warning: $remaining dashboard-related processes may still be running"
  ps aux | grep -E "node.*react-scripts.*saas-dashboard|npm.*start.*saas-dashboard" | grep -v grep
else
  echo "✓ All dashboard services stopped successfully"
fi

echo "Done."
