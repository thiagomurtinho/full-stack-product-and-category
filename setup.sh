#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_header() {
    echo -e "${CYAN}🚀${NC} $1"
}

print_service() {
    echo -e "${PURPLE}🔧${NC} $1"
}

# Function to cleanup on exit
cleanup() {
    echo ""
    print_warning "Stopping all services..."
    
    # Kill all background processes
    if [ ! -z "$API_PID" ]; then
        kill $API_PID 2>/dev/null
        print_info "Stopped API server"
    fi
    
    if [ ! -z "$WEB_PID" ]; then
        kill $WEB_PID 2>/dev/null
        print_info "Stopped Web server"
    fi
    
    if [ ! -z "$PRISMA_PID" ]; then
        kill $PRISMA_PID 2>/dev/null
        print_info "Stopped Prisma Studio"
    fi
    
    print_status "All services stopped"
    echo ""
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo ""
print_header "Full Stack Product and Category - Development Mode"
echo "========================================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm."
    exit 1
fi

print_info "Cleaning up conflicting lockfiles..."
rm -f web/package-lock.json api/package-lock.json package-lock.json

print_info "Installing workspace dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_status "Dependencies installed"

print_info "Starting database..."
docker-compose up -d postgres

if [ $? -ne 0 ]; then
    print_warning "Database might already be running"
fi

print_info "Waiting for database to initialize..."
sleep 5

print_info "Setting up database..."
cd api

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fullstack_product_and_category"' > .env
    print_status "Created .env file"
fi

print_info "Generating Prisma client..."
npm run db:generate

print_info "Resetting and seeding database..."
npm run db:reset

print_info "Building API for production..."
npm run build

cd ..

print_info "Building Web for production..."
cd web

# Temporarily disable Turbopack to avoid issues
if [ -f package.json ]; then
    cp package.json package.json.backup
    sed -i '' 's/"dev": "next dev --turbopack"/"dev": "next dev"/' package.json
    print_status "Temporarily disabled Turbopack"
fi

print_info "Building Next.js application..."
npm run build

cd ..

echo ""
print_header "Starting all services in development mode..."
echo ""

print_service "Starting API server..."
cd api
npm run start:prod > /dev/null 2>&1 &
API_PID=$!
cd ..

print_service "Starting Web server..."
cd web
npm run start > /dev/null 2>&1 &
WEB_PID=$!
cd ..

print_service "Starting Prisma Studio..."
cd api
npx prisma studio > /dev/null 2>&1 &
PRISMA_PID=$!
cd ..

# Wait a moment for services to start
sleep 3

echo ""
print_status "All services started successfully!"
echo ""
echo -e "${CYAN}📱 Service URLs:${NC}"
echo "- 🌐 Frontend (Production): http://localhost:3000"
echo "- 🔧 Backend (Production): http://localhost:5005"
echo "- 📚 API Documentation: http://localhost:5005/api/docs"
echo "- 🗄️  Prisma Studio: http://localhost:5555"
echo ""

print_info "Opening browsers automatically..."

# Open browsers for the main services
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
    print_warning "Could not automatically open browsers. Please open manually:"
    echo "   Frontend: http://localhost:3000"
    echo "   API Docs: http://localhost:5005/api/docs"
    echo "   Prisma Studio: http://localhost:5555"
fi

echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop all services${NC}"
echo ""

# Show real-time logs
echo -e "${CYAN}📄 Real-time logs:${NC}"
echo ""

# Function to show logs with colors
show_logs() {
    # API logs
    if [ -f "api.log" ]; then
        tail -f api.log | sed 's/^/[API] /' &
    fi
    
    # Web logs  
    if [ -f "web.log" ]; then
        tail -f web.log | sed 's/^/[WEB] /' &
    fi
    
    # Prisma logs
    if [ -f "prisma-studio.log" ]; then
        tail -f prisma-studio.log | sed 's/^/[PRISMA] /' &
    fi
}

# Start showing logs
show_logs

# Keep the script running
while true; do
    sleep 1
done 