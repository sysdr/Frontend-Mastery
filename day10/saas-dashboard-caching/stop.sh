#!/bin/bash
set -e
echo "Stopping Day 10 processes..."
APP_PORT=3000
API_PORT=3001
lsof -ti tcp:$APP_PORT | xargs -r kill -9 2>/dev/null || true
lsof -ti tcp:$API_PORT | xargs -r kill -9 2>/dev/null || true
docker stop saas-frontend-day10 2>/dev/null || true
docker rm saas-frontend-day10 2>/dev/null || true
docker stop saas-api-day10 2>/dev/null || true
docker rm saas-api-day10 2>/dev/null || true
echo "Stopped."
