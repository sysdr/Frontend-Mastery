#!/bin/bash
# Comprehensive cleanup script for SaaS Dashboard project
# This script stops all services, removes Docker resources, and cleans up project files
# Run this script from inside the saas-dashboard directory

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="saas-dashboard"

echo "========================================="
echo "Starting Comprehensive Cleanup"
echo "========================================="

# Step 1: Stop all application services
echo ""
echo "Step 1: Stopping application services..."
if [ -f "${SCRIPT_DIR}/stop.sh" ]; then
  bash "${SCRIPT_DIR}/stop.sh" || true
else
  echo "Stop script not found, trying manual cleanup..."
  pkill -f "react-scripts start" || true
  pkill -f "npm.*start" || true
  sleep 1
fi

# Step 2: Stop and remove Docker containers
echo ""
echo "Step 2: Stopping and removing Docker containers..."
if command -v docker >/dev/null 2>&1; then
  # Stop all containers related to the project
  docker ps -a --filter "name=${PROJECT_NAME}" --format "{{.ID}}" | while read container_id; do
    if [ -n "$container_id" ]; then
      echo "Stopping container: $container_id"
      docker stop "$container_id" 2>/dev/null || true
      echo "Removing container: $container_id"
      docker rm "$container_id" 2>/dev/null || true
    fi
  done
  
  # Stop containers with tailwind in name
  docker ps -a --filter "name=tailwind" --format "{{.ID}}" | while read container_id; do
    if [ -n "$container_id" ]; then
      echo "Stopping container: $container_id"
      docker stop "$container_id" 2>/dev/null || true
      echo "Removing container: $container_id"
      docker rm "$container_id" 2>/dev/null || true
    fi
  done
  
  echo "✓ Docker containers cleaned up"
else
  echo "Docker not installed, skipping Docker cleanup"
fi

# Step 3: Remove unused Docker resources
echo ""
echo "Step 3: Removing unused Docker resources..."
if command -v docker >/dev/null 2>&1; then
  echo "Removing unused containers..."
  docker container prune -f 2>/dev/null || true
  
  echo "Removing unused images..."
  docker image prune -a -f 2>/dev/null || true
  
  echo "Removing unused volumes..."
  docker volume prune -f 2>/dev/null || true
  
  echo "Removing unused networks..."
  docker network prune -f 2>/dev/null || true
  
  # Remove specific project images if they exist
  if docker images | grep -q "${PROJECT_NAME}-tailwind"; then
    echo "Removing project-specific Docker images..."
    docker rmi "${PROJECT_NAME}-tailwind" 2>/dev/null || true
    docker rmi "$(docker images "${PROJECT_NAME}-tailwind" -q)" 2>/dev/null || true
  fi
  
  echo "✓ Unused Docker resources removed"
else
  echo "Docker not installed, skipping Docker resource cleanup"
fi

# Step 4: Remove node_modules directories
echo ""
echo "Step 4: Removing node_modules directories..."
find "${SCRIPT_DIR}" -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
echo "✓ node_modules directories removed"

# Step 5: Remove Python virtual environments
echo ""
echo "Step 5: Removing Python virtual environments..."
find "${SCRIPT_DIR}" -type d -name "venv" -exec rm -rf {} + 2>/dev/null || true
find "${SCRIPT_DIR}" -type d -name ".venv" -exec rm -rf {} + 2>/dev/null || true
find "${SCRIPT_DIR}" -type d -name "env" -exec rm -rf {} + 2>/dev/null || true
echo "✓ Python virtual environments removed"

# Step 6: Remove Python cache files
echo ""
echo "Step 6: Removing Python cache files..."
find "${SCRIPT_DIR}" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find "${SCRIPT_DIR}" -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
find "${SCRIPT_DIR}" -type f -name "*.pyc" -delete 2>/dev/null || true
find "${SCRIPT_DIR}" -type f -name "*.pyo" -delete 2>/dev/null || true
find "${SCRIPT_DIR}" -type f -name "*.pyd" -delete 2>/dev/null || true
find "${SCRIPT_DIR}" -type f -name ".Python" -delete 2>/dev/null || true
echo "✓ Python cache files removed"

# Step 7: Remove Istio files
echo ""
echo "Step 7: Removing Istio files..."
find "${SCRIPT_DIR}" -type d -iname "*istio*" -exec rm -rf {} + 2>/dev/null || true
find "${SCRIPT_DIR}" -type f -iname "*istio*" -delete 2>/dev/null || true
echo "✓ Istio files removed"

# Step 8: Remove build directories
echo ""
echo "Step 8: Removing build directories..."
find "${SCRIPT_DIR}" -type d -name "build" -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find "${SCRIPT_DIR}" -type d -name "dist" -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null || true
echo "✓ Build directories removed"

# Step 9: Remove log files
echo ""
echo "Step 9: Removing log files..."
find "${SCRIPT_DIR}" -type f -name "*.log" -not -path "*/node_modules/*" -delete 2>/dev/null || true
find "${SCRIPT_DIR}" -type f -name "npm-debug.log*" -delete 2>/dev/null || true
find "${SCRIPT_DIR}" -type f -name "yarn-debug.log*" -delete 2>/dev/null || true
find "${SCRIPT_DIR}" -type f -name "yarn-error.log*" -delete 2>/dev/null || true
echo "✓ Log files removed"

# Step 10: Remove temporary files
echo ""
echo "Step 10: Removing temporary files..."
find "${SCRIPT_DIR}" -type f -name ".DS_Store" -delete 2>/dev/null || true
find "${SCRIPT_DIR}" -type f -name "Thumbs.db" -delete 2>/dev/null || true
find "${SCRIPT_DIR}" -type f -name "*.swp" -delete 2>/dev/null || true
find "${SCRIPT_DIR}" -type f -name "*.swo" -delete 2>/dev/null || true
find "${SCRIPT_DIR}" -type f -name "*~" -delete 2>/dev/null || true
echo "✓ Temporary files removed"

echo ""
echo "========================================="
echo "Cleanup Complete!"
echo "========================================="
echo ""
echo "Summary of cleaned resources:"
echo "  - Application services stopped"
echo "  - Docker containers removed"
echo "  - Unused Docker resources pruned"
echo "  - node_modules directories removed"
echo "  - Python virtual environments removed"
echo "  - Python cache files removed"
echo "  - Istio files removed"
echo "  - Build directories removed"
echo "  - Log files removed"
echo "  - Temporary files removed"
echo ""
