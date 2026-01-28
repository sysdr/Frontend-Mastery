#!/bin/bash
echo "Stopping services..."
pkill -f "node.*server.js" || true
pkill -f "vite" || true
pkill -f "npm.*dev" || true
echo "Services stopped."
