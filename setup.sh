#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print step with color
print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

# Check if required commands exist
check_requirements() {
    print_step "Checking requirements..."
    
    local requirements=("node" "npm" "python3" "pip3")
    local missing=()
    
    for cmd in "${requirements[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            missing+=("$cmd")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        echo -e "${RED}Error: Missing required commands:${NC} ${missing[*]}"
        echo "Please install these dependencies and try again."
        exit 1
    fi
}

# Set up Python virtual environment and install dependencies
setup_backend() {
    print_step "Setting up backend..."
    
    # Navigate to backend directory
    cd backend
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install Python dependencies from requirements.txt
    pip install -r requirements.txt
    
    # Create required directories
    mkdir -p uploads results/surya static/images
    
    # Go back to root
    cd ..
}

# Set up React frontend
setup_frontend() {
    print_step "Setting up frontend..."
    
    # Navigate to frontend directory
    cd frontend
    
    # Install dependencies
    npm install
    
    # Go back to root
    cd ..
}

# Launch the application
launch_app() {
    print_step "Launching application..."
    
    # Start backend server in background
    cd backend
    source venv/bin/activate
    python app.py &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend development server
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # Wait for both processes
    wait $BACKEND_PID $FRONTEND_PID
}

# Cleanup on script exit
cleanup() {
    print_step "Cleaning up..."
    
    # Kill any remaining processes
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Deactivate virtual environment
    deactivate 2>/dev/null || true
}

# Main script
main() {
    # Store the root directory
    ROOT_DIR=$(pwd)
    
    # Set up trap for cleanup
    trap cleanup EXIT
    
    print_step "Starting setup for Index Extractor..."
    
    # Check requirements
    check_requirements
    
    # Setup backend and frontend
    setup_backend
    setup_frontend
    
    # Launch application
    launch_app
}

# Run main function
main