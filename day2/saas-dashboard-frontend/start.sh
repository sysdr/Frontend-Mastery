#!/bin/bash

# Startup script for SaaS Dashboard Frontend
# Checks for duplicate services and starts the development server

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

VITE_PORT=5173
CONTAINER_NAME="saas-dashboard-frontend-container"

echo "=== SaaS Dashboard Frontend Startup ==="

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check for running Vite processes on the port
echo "Checking for existing Vite processes on port $VITE_PORT..."
if lsof -ti:$VITE_PORT > /dev/null 2>&1; then
    echo "Warning: Port $VITE_PORT is already in use."
    echo "Killing existing process..."
    lsof -ti:$VITE_PORT | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Check for duplicate Docker containers
echo "Checking for existing Docker containers..."
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo "Docker container '$CONTAINER_NAME' is already running."
        echo "Access it at http://localhost:8080"
    else
        echo "Starting existing Docker container..."
        docker start "$CONTAINER_NAME"
    fi
fi

# Start the development server
echo "Starting Vite development server..."
echo "The application will be available at http://localhost:$VITE_PORT"
echo "Press Ctrl+C to stop the server."
npm run dev
