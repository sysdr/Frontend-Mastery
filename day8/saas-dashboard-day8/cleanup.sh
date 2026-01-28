#!/bin/bash

# Cleanup script for SaaS Dashboard Day 8
# This script stops containers and removes unused Docker resources

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Function to display messages
log_info() {
  echo -e "\e[32m[INFO]\e[0m $1"
}

log_warn() {
  echo -e "\e[33m[WARN]\e[0m $1"
}

log_error() {
  echo -e "\e[31m[ERROR]\e[0m $1"
}

log_info "Starting cleanup process..."

# Stop all running containers
log_info "Stopping all running Docker containers..."
if docker ps -q | grep -q .; then
  docker stop $(docker ps -q) 2>/dev/null || true
  log_info "Stopped running containers"
else
  log_info "No running containers to stop"
fi

# Remove all stopped containers
log_info "Removing stopped containers..."
if docker ps -a -q | grep -q .; then
  docker rm -f $(docker ps -a -q) 2>/dev/null || true
  log_info "Removed stopped containers"
else
  log_info "No containers to remove"
fi

# Remove unused images
log_info "Removing unused Docker images..."
docker image prune -a -f 2>/dev/null || true
log_info "Cleaned up unused images"

# Remove unused volumes
log_info "Removing unused Docker volumes..."
docker volume prune -f 2>/dev/null || true
log_info "Cleaned up unused volumes"

# Remove unused networks
log_info "Removing unused Docker networks..."
docker network prune -f 2>/dev/null || true
log_info "Cleaned up unused networks"

# Remove build cache
log_info "Removing Docker build cache..."
docker builder prune -f 2>/dev/null || true
log_info "Cleaned up build cache"

# System prune (optional - removes everything not used)
log_info "Performing system-wide Docker cleanup..."
docker system prune -a -f --volumes 2>/dev/null || true
log_info "System cleanup complete"

log_info "Cleanup process completed successfully!"
