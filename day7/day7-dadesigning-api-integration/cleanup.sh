#!/bin/bash

# Cleanup script for day7-dadesigning-api-integration project
# This script stops all services, removes Docker resources, and cleans up project files

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "🧹 Starting cleanup process..."

# --- Stop all services ---
echo ""
echo "1. Stopping all running services..."
if [ -f "./stop.sh" ]; then
    ./stop.sh
fi

# Kill any remaining Node.js processes
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true
echo "   ✓ Services stopped"

# --- Stop Docker containers ---
echo ""
echo "2. Stopping Docker containers..."
if [ -f "./day-7-frontend-dashboard/docker-compose.yml" ]; then
    docker-compose -f ./day-7-frontend-dashboard/docker-compose.yml down 2>/dev/null || true
    echo "   ✓ Docker Compose services stopped"
fi

# Stop any containers with project-related names
docker ps -a --format "{{.ID}} {{.Names}}" | grep -E "(day7|frontend|backend)" | awk '{print $1}' | xargs -r docker stop 2>/dev/null || true
echo "   ✓ Docker containers stopped"

# --- Remove Docker resources ---
echo ""
echo "3. Removing Docker resources..."

# Remove stopped containers
docker ps -a --format "{{.ID}} {{.Names}}" | grep -E "(day7|frontend|backend)" | awk '{print $1}' | xargs -r docker rm 2>/dev/null || true
echo "   ✓ Removed Docker containers"

# Remove unused images
docker images --format "{{.ID}} {{.Repository}}" | grep -E "(day7|frontend|backend)" | awk '{print $1}' | xargs -r docker rmi 2>/dev/null || true
echo "   ✓ Removed Docker images"

# Remove unused volumes
docker volume ls --format "{{.Name}}" | grep -E "(day7|frontend|backend)" | xargs -r docker volume rm 2>/dev/null || true
echo "   ✓ Removed Docker volumes"

# Prune unused Docker resources
echo ""
echo "4. Pruning unused Docker resources..."
docker system prune -f --volumes 2>/dev/null || true
echo "   ✓ Docker system pruned"

# --- Remove project files ---
echo ""
echo "5. Removing project files..."

# Remove node_modules directories
find . -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
echo "   ✓ Removed node_modules directories"

# Remove Python virtual environments
find . -type d -name "venv" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name ".venv" -exec rm -rf {} + 2>/dev/null || true
echo "   ✓ Removed Python virtual environments"

# Remove Python cache files
find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true
find . -type f -name "*.pyo" -delete 2>/dev/null || true
echo "   ✓ Removed Python cache files"

# Remove Istio files
find . -type f -name "*istio*" -delete 2>/dev/null || true
find . -type f -name "*Istio*" -delete 2>/dev/null || true
find . -type d -name "*istio*" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name "*Istio*" -exec rm -rf {} + 2>/dev/null || true
echo "   ✓ Removed Istio files"

# Remove log files
find . -type f -name "*.log" -delete 2>/dev/null || true
echo "   ✓ Removed log files"

# Remove temporary files
find . -type f -name ".DS_Store" -delete 2>/dev/null || true
find . -type f -name "*.swp" -delete 2>/dev/null || true
find . -type f -name "*.swo" -delete 2>/dev/null || true
find . -type f -name "*~" -delete 2>/dev/null || true
echo "   ✓ Removed temporary files"

echo ""
echo "✅ Cleanup completed successfully!"
echo ""
echo "Remaining project structure:"
ls -la | grep -v "^d" | head -20
