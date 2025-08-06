#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    echo -e "${CYAN}🛑${NC} $1"
}

echo ""
print_header "Stopping All Services"
echo "========================"
echo ""

# Function to check if a port is in use
check_port() {
    local port=$1
    local service=$2
    local pid=$(lsof -ti:$port 2>/dev/null)
    
    if [ ! -z "$pid" ]; then
        print_info "Found $service running on port $port (PID: $pid)"
        return 0
    else
        print_warning "$service not running on port $port"
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local service=$2
    local pid=$(lsof -ti:$port 2>/dev/null)
    
    if [ ! -z "$pid" ]; then
        print_info "Stopping $service on port $port (PID: $pid)..."
        kill $pid 2>/dev/null
        sleep 1
        
        # Check if process is still running
        if lsof -ti:$port > /dev/null 2>&1; then
            print_warning "$service still running, force killing..."
            kill -9 $pid 2>/dev/null
        fi
        
        print_status "$service stopped"
    else
        print_warning "$service not running on port $port"
    fi
}

# Check and stop services
print_info "Checking running services..."

# Check API server (port 5005)
if check_port 5005 "API Server"; then
    kill_port 5005 "API Server"
fi

# Check Web server (port 3000)
if check_port 3000 "Web Server"; then
    kill_port 3000 "Web Server"
fi

# Check Prisma Studio (port 5555)
if check_port 5555 "Prisma Studio"; then
    kill_port 5555 "Prisma Studio"
fi

# Check database (port 5432)
if check_port 5432 "PostgreSQL Database"; then
    print_info "PostgreSQL database is running"
    print_info "To stop database: docker-compose down"
fi

echo ""
print_info "Cleaning up log files..."

# Remove log files
rm -f api.log web.log prisma-studio.log

echo ""
print_status "All services stopped and cleaned up!"
echo ""
print_info "Available commands:"
echo "- npm run dev:interactive  # Start in interactive mode"
echo "- npm run start:prod       # Start in production mode"
echo "- bash setup.sh            # Production setup"
echo "- bash setup-interactive.sh # Interactive setup"
echo "" 