#!/bin/bash

echo "🛑 Stopping all services..."

# Find and kill processes by port
echo "🔍 Finding processes on ports 3000, 5000, and 5555..."

# Kill processes on port 3000 (Web)
WEB_PID=$(lsof -ti:3000)
if [ ! -z "$WEB_PID" ]; then
    echo "🛑 Stopping Web server (PID: $WEB_PID)..."
    kill $WEB_PID
else
    echo "ℹ️  No Web server found on port 3000"
fi

# Kill processes on port 5000 (API)
API_PID=$(lsof -ti:5005)
if [ ! -z "$API_PID" ]; then
    echo "🛑 Stopping API server (PID: $API_PID)..."
    kill $API_PID
else
    echo "ℹ️  No API server found on port 5000"
fi

# Kill processes on port 5555 (Prisma Studio)
PRISMA_PID=$(lsof -ti:5555)
if [ ! -z "$PRISMA_PID" ]; then
    echo "🛑 Stopping Prisma Studio (PID: $PRISMA_PID)..."
    kill $PRISMA_PID
else
    echo "ℹ️  No Prisma Studio found on port 5555"
fi

echo "✅ All services stopped!"
echo ""
echo "📄 Log files available:"
echo "- api.log"
echo "- web.log"
echo "- prisma-studio.log" 