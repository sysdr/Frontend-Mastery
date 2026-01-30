#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_IMAGE_NAME="saas-dashboard-prefs-app"
DOCKER_CONTAINER_NAME="saas-dashboard-prefs-container"
PORT=5173

cd "$SCRIPT_DIR"

echo "--- Starting SaaS Dashboard Application ---"

# Check if serve is installed
if ! command -v serve &> /dev/null; then
    echo "Installing 'serve' globally for preview..."
    npm install -g serve > /dev/null 2>&1
fi

# Check if port is already in use
if lsof -t -i:$PORT &> /dev/null; then
    echo "Port $PORT is already in use. Stopping existing process..."
    kill $(lsof -t -i:$PORT) 2>/dev/null || true
    sleep 2
fi

# Start non-Docker application
echo "Starting standalone application on http://localhost:$PORT ..."
nohup serve -s dist -p $PORT > serve.log 2>&1 &
APP_PID=$!
echo "Application running with PID $APP_PID."
sleep 3

# Verify non-Docker application (React apps serve HTML shell, content rendered via JS)
if curl -s http://localhost:$PORT | grep -q "root"; then
    echo "Standalone application is running successfully."
else
    echo "Warning: Standalone application may not be responding correctly."
fi

# Check for Docker and start Docker version
if command -v docker &> /dev/null; then
    # Check if port 8080 is available
    if lsof -t -i:8080 &> /dev/null; then
        echo "Port 8080 is already in use. Stopping existing process..."
        kill $(lsof -t -i:8080) 2>/dev/null || true
        sleep 2
    fi
    
    # Stop existing container if running
    docker rm -f "$DOCKER_CONTAINER_NAME" > /dev/null 2>&1 || true
    
    # Build if image doesn't exist
    if ! docker images --format '{{.Repository}}' | grep -q "$DOCKER_IMAGE_NAME"; then
        echo "Building Docker image..."
        docker build -t "$DOCKER_IMAGE_NAME" . > /dev/null 2>&1
    fi
    
    echo "Starting Docker container on http://localhost:8080 ..."
    docker run -d -p 8080:80 --name "$DOCKER_CONTAINER_NAME" "$DOCKER_IMAGE_NAME" > /dev/null 2>&1
    sleep 3
    
    if curl -s http://localhost:8080 | grep -q "root"; then
        echo "Dockerized application is running successfully."
    else
        echo "Warning: Dockerized application may not be responding correctly."
    fi
fi

echo ""
echo "Applications are running:"
echo "  - Standalone app: http://localhost:$PORT"
if command -v docker &> /dev/null; then
    echo "  - Dockerized app: http://localhost:8080"
fi
echo "Run './stop.sh' to stop all services."
