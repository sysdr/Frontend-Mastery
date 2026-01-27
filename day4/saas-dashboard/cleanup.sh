#!/bin/bash

# Cleanup script for SaaS Dashboard project
# Stops containers and removes unused Docker resources, volumes, containers and images

set -e

echo "=== Starting Cleanup Process ==="

# Stop all running Docker containers
echo "Stopping all Docker containers..."
docker stop $(docker ps -aq) 2>/dev/null || echo "No running containers to stop"

# Remove all stopped containers
echo "Removing stopped containers..."
docker rm $(docker ps -aq) 2>/dev/null || echo "No containers to remove"

# Remove unused volumes
echo "Removing unused volumes..."
docker volume prune -f || echo "No volumes to remove"

# Remove unused networks
echo "Removing unused networks..."
docker network prune -f || echo "No networks to remove"

# Remove unused images
echo "Removing unused images..."
docker image prune -af || echo "No images to remove"

# Remove all unused Docker resources (comprehensive cleanup)
echo "Performing comprehensive Docker cleanup..."
docker system prune -af --volumes || echo "Docker cleanup completed"

echo "=== Docker Cleanup Complete ==="

# Remove project-specific files
echo "Removing project-specific files..."

# Remove node_modules
if [ -d "node_modules" ]; then
    echo "Removing node_modules..."
    rm -rf node_modules
fi

# Remove venv directories
find . -type d -name "venv" -exec rm -rf {} + 2>/dev/null || true
echo "Removed venv directories"

# Remove .pytest_cache directories
find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
echo "Removed .pytest_cache directories"

# Remove .pyc files
find . -type f -name "*.pyc" -delete 2>/dev/null || true
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
echo "Removed .pyc files and __pycache__ directories"

# Remove Istio files
find . -type f -name "*istio*" -delete 2>/dev/null || true
find . -type d -name "*istio*" -exec rm -rf {} + 2>/dev/null || true
echo "Removed Istio files"

# Remove build artifacts
if [ -d "build" ]; then
    echo "Removing build directory..."
    rm -rf build
fi

# Remove coverage directory
if [ -d "coverage" ]; then
    echo "Removing coverage directory..."
    rm -rf coverage
fi

# Remove log files
rm -f npm-debug.log* yarn-debug.log* yarn-error.log* 2>/dev/null || true
echo "Removed log files"

# Remove .npm_pid if exists
rm -f .npm_pid 2>/dev/null || true

echo "=== Cleanup Complete ==="
