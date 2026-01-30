#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="saas-dashboard-prefs"
DOCKER_IMAGE_NAME="saas-dashboard-prefs-app"
DOCKER_CONTAINER_NAME="saas-dashboard-prefs-container"
PORT=5173

echo "--- Stopping and Cleaning Up ---"

# Stop non-Docker application
echo "Stopping non-Docker application..."
# Find PID of serve process running on $PORT
SERVE_PID=$(lsof -t -i:$PORT 2>/dev/null || true)
if [ -n "$SERVE_PID" ]; then
    kill "$SERVE_PID" 2>/dev/null || true
    echo "Non-Docker application (PID $SERVE_PID) stopped."
else
    echo "Non-Docker application not found or not running."
fi

# Stop and remove Docker container
echo "Stopping and removing Docker container '$DOCKER_CONTAINER_NAME'..."
if docker ps -a --format '{{.Names}}' | grep -q "$DOCKER_CONTAINER_NAME"; then
    docker rm -f "$DOCKER_CONTAINER_NAME" > /dev/null 2>&1
    echo "Docker container '$DOCKER_CONTAINER_NAME' stopped and removed."
else
    echo "Docker container '$DOCKER_CONTAINER_NAME' not found or not running."
fi

# Remove Docker image
echo "Removing Docker image '$DOCKER_IMAGE_NAME'..."
if docker images --format '{{.Repository}}' | grep -q "$DOCKER_IMAGE_NAME"; then
    docker rmi "$DOCKER_IMAGE_NAME" > /dev/null 2>&1
    echo "Docker image '$DOCKER_IMAGE_NAME' removed."
else
    echo "Docker image '$DOCKER_IMAGE_NAME' not found."
fi

echo "Cleanup complete."
