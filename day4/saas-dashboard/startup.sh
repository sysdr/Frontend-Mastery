#!/bin/bash

# Get the directory where this script is located (project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="3000"

cd "${SCRIPT_DIR}" || exit 1

# Check if already running
if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "Warning: Port ${PORT} is already in use."
  echo "Checking for existing npm processes..."
  if pgrep -f "react-scripts start" > /dev/null; then
    echo "Found existing React development server. Stopping it..."
    pkill -f "react-scripts start"
    sleep 2
  fi
fi

echo "Starting React development server..."
npm start > /dev/null 2>&1 &
NPM_PID=$!
echo "${NPM_PID}" > .npm_pid

echo "Waiting for server to start..."
sleep 8

if curl -s http://localhost:${PORT} > /dev/null 2>&1; then
  echo "✓ Application is running at http://localhost:${PORT}"
  echo "PID: ${NPM_PID}"
else
  echo "✗ Application failed to start"
  exit 1
fi
