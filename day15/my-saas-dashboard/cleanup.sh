#!/bin/bash

# Cleanup script for SaaS Dashboard project
# This script stops containers and removes unused Docker resources

set -e

echo "🧹 Starting cleanup process..."

# --- Stop running services ---
echo "1. Stopping running services..."
pkill -f "serve -s build" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
echo "   ✅ Node.js services stopped"

# --- Docker cleanup (if Docker is available) ---
echo "2. Checking Docker availability..."
if command -v docker &> /dev/null && docker info &> /dev/null; then
    echo "   Docker is available, starting cleanup..."
    
    # Stop all running containers
    echo "   Stopping all running containers..."
    docker ps -q | xargs -r docker stop 2>/dev/null || true
    
    # Remove stopped containers
    echo "   Removing stopped containers..."
    docker container prune -f 2>/dev/null || true
    
    # Remove unused images
    echo "   Removing unused images..."
    docker image prune -f 2>/dev/null || true
    
    # Remove unused volumes
    echo "   Removing unused volumes..."
    docker volume prune -f 2>/dev/null || true
    
    # Remove unused networks
    echo "   Removing unused networks..."
    docker network prune -f 2>/dev/null || true
    
    # Remove all unused Docker resources (dangling)
    echo "   Removing all unused Docker resources..."
    docker system prune -f 2>/dev/null || true
    
    # Remove specific project containers if they exist
    docker stop my-saas-dashboard-container 2>/dev/null || true
    docker rm my-saas-dashboard-container 2>/dev/null || true
    
    # Remove specific project images if they exist
    docker rmi my-saas-dashboard-app 2>/dev/null || true
    
    echo "   ✅ Docker cleanup complete"
else
    echo "   Docker not available or not running - skipping Docker cleanup"
fi

# --- Remove build artifacts ---
echo "3. Removing build artifacts..."
rm -rf build 2>/dev/null || true
rm -rf node_modules 2>/dev/null || true
rm -rf .cache 2>/dev/null || true
echo "   ✅ Build artifacts removed"

# --- Remove cache files ---
echo "4. Removing cache files..."
rm -rf .pytest_cache 2>/dev/null || true
rm -rf __pycache__ 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
rm -rf coverage 2>/dev/null || true
rm -rf .nyc_output 2>/dev/null || true
echo "   ✅ Cache files removed"

# --- Remove log files ---
echo "5. Removing log files..."
rm -rf logs 2>/dev/null || true
rm -f *.log 2>/dev/null || true
rm -f npm-debug.log* 2>/dev/null || true
rm -f yarn-debug.log* 2>/dev/null || true
rm -f yarn-error.log* 2>/dev/null || true
echo "   ✅ Log files removed"

echo ""
echo "🎉 Cleanup complete!"
echo ""
echo "To reinstall dependencies, run: npm install"
echo "To rebuild the project, run: npm run build"
