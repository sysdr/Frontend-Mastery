#!/bin/bash
# Cleanup script for Docker resources
# Stops containers and removes unused Docker resources, volumes, containers and images

set -e

echo "🧹 Starting Docker cleanup..."

# Stop all running containers
echo "1. Stopping all running containers..."
docker stop $(docker ps -aq) 2>/dev/null || echo "   No containers to stop"

# Remove all stopped containers
echo "2. Removing stopped containers..."
docker rm $(docker ps -aq) 2>/dev/null || echo "   No containers to remove"

# Remove unused images
echo "3. Removing unused images..."
docker image prune -a -f 2>/dev/null || echo "   No unused images to remove"

# Remove unused volumes
echo "4. Removing unused volumes..."
docker volume prune -f 2>/dev/null || echo "   No unused volumes to remove"

# Remove unused networks
echo "5. Removing unused networks..."
docker network prune -f 2>/dev/null || echo "   No unused networks to remove"

# Remove all unused resources (comprehensive cleanup)
echo "6. Performing comprehensive cleanup (all unused resources)..."
docker system prune -a --volumes -f 2>/dev/null || echo "   Cleanup complete"

echo ""
echo "✅ Docker cleanup completed!"
echo ""
echo "Remaining Docker resources:"
docker ps -a
echo ""
docker images
echo ""
docker volume ls
