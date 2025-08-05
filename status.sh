#!/bin/bash

echo "📊 Service Status Check"
echo "======================"

# Check if database is running
echo "🐘 Database (PostgreSQL):"
if docker ps | grep -q "full-stack-product-and-category-postgres"; then
    echo "✅ Running on port 5432"
else
    echo "❌ Not running"
fi

echo ""

# Check API server
echo "🔧 API Server:"
API_PID=$(lsof -ti:5000)
if [ ! -z "$API_PID" ]; then
    echo "✅ Running on port 5000 (PID: $API_PID)"
    echo "   📚 API Docs: http://localhost:5000/api/docs"
else
    echo "❌ Not running on port 5000"
fi

echo ""

# Check Web server
echo "🌐 Web Server:"
WEB_PID=$(lsof -ti:3000)
if [ ! -z "$WEB_PID" ]; then
    echo "✅ Running on port 3000 (PID: $WEB_PID)"
    echo "   🌐 Frontend: http://localhost:3000"
else
    echo "❌ Not running on port 3000"
fi

echo ""

# Check Prisma Studio
echo "🗄️ Prisma Studio:"
PRISMA_PID=$(lsof -ti:5555)
if [ ! -z "$PRISMA_PID" ]; then
    echo "✅ Running on port 5555 (PID: $PRISMA_PID)"
    echo "   🗄️ Database UI: http://localhost:5555"
else
    echo "❌ Not running on port 5555"
fi

echo ""
echo "📄 Log files:"
if [ -f "api.log" ]; then
    echo "✅ api.log exists"
else
    echo "❌ api.log not found"
fi

if [ -f "web.log" ]; then
    echo "✅ web.log exists"
else
    echo "❌ web.log not found"
fi

if [ -f "prisma-studio.log" ]; then
    echo "✅ prisma-studio.log exists"
else
    echo "❌ prisma-studio.log not found"
fi

echo ""
echo "🛑 To stop all services: bash stop-services.sh"
echo "🚀 To start all services: bash setup.sh" 