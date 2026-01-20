#!/bin/bash
# Startup script for SaaS Dashboard
# This script should be run from inside the saas-dashboard directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_PORT=3000

# Verify we're in the right directory
if [ ! -f "${SCRIPT_DIR}/package.json" ]; then
  echo "Error: package.json not found in ${SCRIPT_DIR}"
  echo "Please run this script from the saas-dashboard directory."
  exit 1
fi

# Check if service is already running
if command -v lsof >/dev/null 2>&1 && lsof -Pi :${APP_PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "Warning: Port ${APP_PORT} is already in use."
  echo "Checking for existing node processes..."
  ps aux | grep -E "node.*react-scripts|npm.*start" | grep -v grep || true
  read -p "Kill existing process? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Stopping existing processes..."
    pkill -f "react-scripts start" || true
    pkill -f "npm.*start" || true
    sleep 2
    echo "Existing processes stopped."
  else
    echo "Exiting. Please stop the existing service first."
    exit 1
  fi
fi

echo "Starting application from ${SCRIPT_DIR}..."
echo "Application will be available at http://localhost:${APP_PORT}"
cd "${SCRIPT_DIR}"
npm start
