#!/bin/bash

# Get the directory where this script is located (project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="5173"

cd "${SCRIPT_DIR}" || exit 1

# Check if already running
if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "Warning: Port ${PORT} is already in use."
  echo "Checking for existing Vite processes..."
  if pgrep -f "vite" > /dev/null; then
    echo "Found existing Vite development server. Stopping it..."
    pkill -f "vite"
    sleep 2
  fi
fi

echo "Starting Vite development server..."
npm run dev > /dev/null 2>&1 &
VITE_PID=$!
echo "${VITE_PID}" > .vite_pid

echo "Waiting for server to start..."
sleep 8

if curl -s http://localhost:${PORT} > /dev/null 2>&1; then
  echo "✓ Application is running at http://localhost:${PORT}"
  echo "PID: ${VITE_PID}"
else
  echo "✗ Application failed to start"
  exit 1
fi
