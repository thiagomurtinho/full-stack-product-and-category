#!/bin/bash

echo "🚀 Starting Full Stack Product and Category setup..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm."
    exit 1
fi

echo "🧹 Cleaning up conflicting lockfiles..."
# Remove conflicting lockfiles that might cause issues
rm -f web/package-lock.json
rm -f api/package-lock.json
rm -f package-lock.json

echo "📦 Installing workspace dependencies..."
npm install

echo "🐘 Starting database..."
docker-compose up -d postgres

echo "⏳ Waiting for database to initialize..."
sleep 10

echo "🔧 Setting up database..."
cd api

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fullstack_product_and_category"' > .env
fi

# Generate Prisma client and populate database
echo "🔧 Generating Prisma client..."
npm run db:generate

echo "🌱 Resetting and seeding database..."
npm run db:reset

echo "🏗️ Building API for production..."
npm run build

cd ..

echo "🏗️ Building Web for production..."
cd web

# Temporarily disable Turbopack to avoid issues
if [ -f package.json ]; then
    # Create a backup of the original package.json
    cp package.json package.json.backup
    
    # Update the dev script to not use turbopack
    sed -i '' 's/"dev": "next dev --turbopack"/"dev": "next dev"/' package.json
    
    echo "✅ Temporarily disabled Turbopack to avoid startup issues"
fi

echo "🏗️ Building Next.js application..."
npm run build

cd ..

echo "🚀 Starting all services in production mode..."

# Start API in production mode
echo "🔧 Starting API server in production mode..."
cd api
nohup npm run start:prod > ../api.log 2>&1 &
API_PID=$!
cd ..

# Start Web in production mode
echo "🌐 Starting Web server in production mode..."
cd web
nohup npm run start > ../web.log 2>&1 &
WEB_PID=$!
cd ..

# Start Prisma Studio
echo "🗄️ Starting Prisma Studio..."
cd api
nohup npx prisma studio > ../prisma-studio.log 2>&1 &
PRISMA_PID=$!
cd ..

# Wait a moment for services to start
sleep 5

echo ""
echo "✅ All services started successfully!"
echo ""
echo "📱 Service URLs:"
echo "- 🌐 Frontend (Production): http://localhost:3000"
echo "- 🔧 Backend (Production): http://localhost:5005"
echo "- 📚 API Documentation: http://localhost:5005/api/docs"
echo "- 🗄️ Prisma Studio: http://localhost:5555"
echo ""
echo "🌐 Opening browsers automatically..."

# Open browsers for the main services (Prisma Studio opens automatically)
if command -v open &> /dev/null; then
    # macOS
    sleep 2 && open http://localhost:3000 &
    sleep 3 && open http://localhost:5005/api/docs &
elif command -v xdg-open &> /dev/null; then
    # Linux
    sleep 2 && xdg-open http://localhost:3000 &
    sleep 3 && xdg-open http://localhost:5005/api/docs &
elif command -v start &> /dev/null; then
    # Windows
    sleep 2 && start http://localhost:3000 &
    sleep 3 && start http://localhost:5005/api/docs &
else
    echo "⚠️  Could not automatically open browsers. Please open manually:"
    echo "   Frontend: http://localhost:3000"
    echo "   API Docs: http://localhost:5005/api/docs"
    echo "   Prisma Studio: http://localhost:5555 (opens automatically)"
fi

echo ""
echo "📋 Process IDs (for stopping services):"
echo "- API: $API_PID"
echo "- Web: $WEB_PID"
echo "- Prisma Studio: $PRISMA_PID"
echo ""
echo "📄 Log files:"
echo "- API logs: api.log"
echo "- Web logs: web.log"
echo "- Prisma Studio logs: prisma-studio.log"
echo ""
echo "🛑 To stop all services:"
echo "kill $API_PID $WEB_PID $PRISMA_PID"
echo ""
echo "💡 Tip: You can also use 'npm run start:prod' from the root directory"
echo ""
echo "⚠️  Note: Turbopack was temporarily disabled to avoid startup issues."
echo "   To re-enable it later, run: bash restore-turbopack.sh" 