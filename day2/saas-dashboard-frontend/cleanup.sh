#!/bin/bash

# Cleanup script for Docker resources and project files
# This script stops containers and removes unused Docker resources

set -e

echo "=== Docker Cleanup Script ==="
echo ""

# Stop all running containers
echo "Stopping all running containers..."
docker ps -q | xargs -r docker stop 2>/dev/null || echo "No running containers to stop"

# Remove all stopped containers
echo "Removing all stopped containers..."
docker ps -a -q | xargs -r docker rm 2>/dev/null || echo "No containers to remove"

# Remove unused images
echo "Removing unused Docker images..."
docker image prune -a -f 2>/dev/null || echo "No unused images to remove"

# Remove unused volumes
echo "Removing unused Docker volumes..."
docker volume prune -f 2>/dev/null || echo "No unused volumes to remove"

# Remove unused networks
echo "Removing unused Docker networks..."
docker network prune -f 2>/dev/null || echo "No unused networks to remove"

# Remove build cache
echo "Removing Docker build cache..."
docker builder prune -a -f 2>/dev/null || echo "No build cache to remove"

echo ""
echo "=== Docker Cleanup Complete ==="
echo ""
echo "Remaining Docker resources:"
echo "Containers: $(docker ps -a -q | wc -l)"
echo "Images: $(docker images -q | wc -l)"
echo "Volumes: $(docker volume ls -q | wc -l)"
