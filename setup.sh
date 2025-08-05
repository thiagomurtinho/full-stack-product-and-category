#!/bin/bash

echo "🚀 Starting Full Stack Product and Category setup..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing..."
    npm install -g pnpm
fi

echo "📦 Installing workspace dependencies..."
pnpm install

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
pnpm db:generate
pnpm db:reset

cd ..

echo "✅ Setup completed!"
echo ""
echo "🎯 To start the project:"
echo "1. Run both: pnpm dev"
echo "2. Or separately: pnpm dev:api && pnpm dev:web"
echo ""
echo "💡 Tip: You can also use 'pnpm setup' from the root directory"
echo ""
echo "📱 URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:5000"
echo "- API Docs: http://localhost:5000/api/docs" 