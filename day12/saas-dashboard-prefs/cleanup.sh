#!/bin/bash

# Cleanup script for SaaS Dashboard Prefs project
# This script stops all running services and removes Docker resources

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="saas-dashboard-prefs"
DOCKER_IMAGE_NAME="saas-dashboard-prefs-app"
DOCKER_CONTAINER_NAME="saas-dashboard-prefs-container"
PORT=5173

echo "=============================================="
echo "  SaaS Dashboard Cleanup Script"
echo "=============================================="
echo ""

# 1. Stop standalone application
echo "[1/6] Stopping standalone application on port $PORT..."
if lsof -t -i:$PORT &> /dev/null; then
    kill $(lsof -t -i:$PORT) 2>/dev/null || true
    echo "      Stopped process on port $PORT"
else
    echo "      No process running on port $PORT"
fi

# 2. Stop and remove Docker container
echo ""
echo "[2/6] Stopping and removing Docker container..."
if docker ps -a --format '{{.Names}}' | grep -q "^${DOCKER_CONTAINER_NAME}$"; then
    docker stop "$DOCKER_CONTAINER_NAME" 2>/dev/null || true
    docker rm "$DOCKER_CONTAINER_NAME" 2>/dev/null || true
    echo "      Container '$DOCKER_CONTAINER_NAME' stopped and removed"
else
    echo "      Container '$DOCKER_CONTAINER_NAME' not found"
fi

# 3. Remove Docker image
echo ""
echo "[3/6] Removing Docker image..."
if docker images --format '{{.Repository}}' | grep -q "^${DOCKER_IMAGE_NAME}$"; then
    docker rmi "$DOCKER_IMAGE_NAME" 2>/dev/null || true
    echo "      Image '$DOCKER_IMAGE_NAME' removed"
else
    echo "      Image '$DOCKER_IMAGE_NAME' not found"
fi

# 4. Remove unused Docker resources (dangling images, stopped containers, unused networks)
echo ""
echo "[4/6] Removing unused Docker resources..."
echo "      Removing dangling images..."
docker image prune -f 2>/dev/null || true
echo "      Removing stopped containers..."
docker container prune -f 2>/dev/null || true
echo "      Removing unused networks..."
docker network prune -f 2>/dev/null || true

# 5. Remove unused Docker volumes (optional - be careful with this)
echo ""
echo "[5/6] Removing unused Docker volumes..."
docker volume prune -f 2>/dev/null || true
echo "      Unused volumes removed"

# 6. Clean up local build artifacts
echo ""
echo "[6/6] Cleaning up local build artifacts..."
cd "$SCRIPT_DIR"

# Remove node_modules
if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "      Removed node_modules"
fi

# Remove dist
if [ -d "dist" ]; then
    rm -rf dist
    echo "      Removed dist"
fi

# Remove serve.log
if [ -f "serve.log" ]; then
    rm -f serve.log
    echo "      Removed serve.log"
fi

# Remove package-lock.json (optional)
# if [ -f "package-lock.json" ]; then
#     rm -f package-lock.json
#     echo "      Removed package-lock.json"
# fi

echo ""
echo "=============================================="
echo "  Cleanup Complete!"
echo "=============================================="
echo ""
echo "To reinstall and run the project:"
echo "  1. npm install"
echo "  2. npm run build"
echo "  3. ./start.sh"
echo ""
