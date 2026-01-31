#!/bin/bash

# Cleanup script for SaaS Dashboard Day16
# This script stops all services and removes Docker resources

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=============================================="
echo "  SaaS Dashboard Cleanup Script"
echo "=============================================="

# --- 1. Stop local development server ---
echo ""
echo "1. Stopping local development server..."
if [ -f .server_pid ]; then
    PID=$(cat .server_pid)
    if ps -p "$PID" > /dev/null 2>&1; then
        kill "$PID" 2>/dev/null || true
        echo "   Stopped process with PID $PID"
    fi
    rm -f .server_pid
fi

# Kill any process on port 3000
if command -v lsof &> /dev/null; then
    lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null || true
fi
echo "   Local server stopped."

# --- 2. Stop Docker containers ---
echo ""
echo "2. Stopping Docker containers..."
if command -v docker &> /dev/null; then
    if [ -f docker-compose.yml ]; then
        docker-compose down 2>/dev/null || docker compose down 2>/dev/null || true
        echo "   Docker containers stopped."
    fi
else
    echo "   Docker not available, skipping..."
fi

# --- 3. Remove Docker resources ---
echo ""
echo "3. Removing unused Docker resources..."
if command -v docker &> /dev/null; then
    # Remove containers related to this project
    docker ps -a --filter "name=saas-dashboard" -q 2>/dev/null | xargs docker rm -f 2>/dev/null || true
    
    # Remove images related to this project
    docker images --filter "reference=*saas-dashboard*" -q 2>/dev/null | xargs docker rmi -f 2>/dev/null || true
    
    # Remove dangling images
    docker image prune -f 2>/dev/null || true
    
    # Remove unused volumes
    docker volume prune -f 2>/dev/null || true
    
    # Remove unused networks
    docker network prune -f 2>/dev/null || true
    
    # Remove build cache
    docker builder prune -f 2>/dev/null || true
    
    echo "   Docker resources cleaned."
else
    echo "   Docker not available, skipping..."
fi

# --- 4. Remove node_modules ---
echo ""
echo "4. Removing node_modules..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "   node_modules removed."
else
    echo "   node_modules not found, skipping..."
fi

# --- 5. Remove build artifacts ---
echo ""
echo "5. Removing build artifacts..."
rm -rf dist 2>/dev/null || true
rm -rf build 2>/dev/null || true
rm -rf .cache 2>/dev/null || true
rm -rf coverage 2>/dev/null || true
echo "   Build artifacts removed."

# --- 6. Remove Python cache files ---
echo ""
echo "6. Removing Python cache files..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name "venv" -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -delete 2>/dev/null || true
find . -name "*.pyo" -delete 2>/dev/null || true
echo "   Python cache files removed."

# --- 7. Remove Istio files ---
echo ""
echo "7. Removing Istio files..."
find . -name "istio*" -delete 2>/dev/null || true
find . -name "Istio*" -delete 2>/dev/null || true
echo "   Istio files removed."

# --- 8. Remove temporary files ---
echo ""
echo "8. Removing temporary files..."
rm -rf .server_pid 2>/dev/null || true
rm -rf *.log 2>/dev/null || true
rm -rf .DS_Store 2>/dev/null || true
find . -name "*.tmp" -delete 2>/dev/null || true
find . -name "*.temp" -delete 2>/dev/null || true
echo "   Temporary files removed."

echo ""
echo "=============================================="
echo "  Cleanup Complete!"
echo "=============================================="
echo ""
echo "To reinstall dependencies: npm install"
echo "To start the app: ./startup.sh"
