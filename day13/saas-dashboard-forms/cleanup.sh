#!/bin/bash

# ============================================
# Day 13 - Cleanup Script
# Stops containers and removes unused Docker resources
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

PROJECT_NAME="saas-dashboard-forms"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "============================================"
echo "  Day 13 - Cleanup Script"
echo "============================================"
echo ""

# Stop local dev server
log_info "Stopping local development server..."
if [ -f "$SCRIPT_DIR/.npm_pid" ]; then
    PID=$(cat "$SCRIPT_DIR/.npm_pid")
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID 2>/dev/null || true
        log_info "Stopped dev server (PID: $PID)"
    fi
    rm -f "$SCRIPT_DIR/.npm_pid"
fi

# Kill any process on port 3000 or 5173
for PORT in 3000 5173; do
    PID=$(lsof -t -i:$PORT 2>/dev/null || true)
    if [ -n "$PID" ]; then
        kill $PID 2>/dev/null || true
        log_info "Killed process on port $PORT"
    fi
done

# Stop Docker containers
log_info "Stopping Docker containers..."
CONTAINER_IDS=$(docker ps -q --filter "name=$PROJECT_NAME" 2>/dev/null || true)
if [ -n "$CONTAINER_IDS" ]; then
    docker stop $CONTAINER_IDS 2>/dev/null || true
    log_info "Stopped containers: $CONTAINER_IDS"
fi

# Remove Docker containers
log_info "Removing Docker containers..."
CONTAINER_IDS=$(docker ps -aq --filter "name=$PROJECT_NAME" 2>/dev/null || true)
if [ -n "$CONTAINER_IDS" ]; then
    docker rm $CONTAINER_IDS 2>/dev/null || true
    log_info "Removed containers: $CONTAINER_IDS"
fi

# Remove Docker images
log_info "Removing Docker images..."
IMAGE_IDS=$(docker images -q "$PROJECT_NAME" 2>/dev/null || true)
if [ -n "$IMAGE_IDS" ]; then
    docker rmi $IMAGE_IDS 2>/dev/null || true
    log_info "Removed images: $IMAGE_IDS"
fi

# Remove unused Docker resources
log_info "Removing unused Docker resources..."

# Remove dangling images
log_info "Removing dangling images..."
docker image prune -f 2>/dev/null || true

# Remove unused volumes
log_info "Removing unused volumes..."
docker volume prune -f 2>/dev/null || true

# Remove unused networks
log_info "Removing unused networks..."
docker network prune -f 2>/dev/null || true

# Remove build cache
log_info "Removing build cache..."
docker builder prune -f 2>/dev/null || true

# Clean up local files
log_info "Cleaning up local files..."
cd "$SCRIPT_DIR"

# Remove node_modules
if [ -d "node_modules" ]; then
    rm -rf node_modules
    log_info "Removed node_modules"
fi

# Remove dist folder
if [ -d "dist" ]; then
    rm -rf dist
    log_info "Removed dist folder"
fi

# Remove .npm_pid
rm -f .npm_pid 2>/dev/null || true

# Remove package-lock.json (optional - uncomment if needed)
# rm -f package-lock.json 2>/dev/null || true

echo ""
echo "============================================"
log_info "Cleanup complete!"
echo "============================================"

# Show Docker disk usage
echo ""
log_info "Current Docker disk usage:"
docker system df 2>/dev/null || echo "Docker not running"
