#!/bin/bash

# YouTube Transcription Service - Easy Setup Script for Raspberry Pi
# This script sets up the YouTube transcription service on your Raspberry Pi

set -e  # Exit on error

echo "=================================================="
echo "YouTube Transcription Service Setup"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if Python 3 is installed
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Installing..."
    sudo apt-get update
    sudo apt-get install -y python3 python3-pip python3-venv
else
    print_status "Python 3 is installed"
fi

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
print_status "Python version: $PYTHON_VERSION"

# Create virtual environment
echo ""
echo "Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_status "Virtual environment created"
else
    print_warning "Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
print_status "Virtual environment activated"

# Upgrade pip
echo ""
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt
print_status "Dependencies installed"

# Create systemd service file (optional, for auto-start)
echo ""
read -p "Do you want to create a systemd service for auto-start? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    SERVICE_FILE="/etc/systemd/system/youtube-transcriber.service"
    CURRENT_DIR=$(pwd)
    USER=$(whoami)
    
    echo "Creating systemd service..."
    sudo tee $SERVICE_FILE > /dev/null <<EOF
[Unit]
Description=YouTube Transcription Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$CURRENT_DIR
Environment="PATH=$CURRENT_DIR/venv/bin"
ExecStart=$CURRENT_DIR/venv/bin/python server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable youtube-transcriber.service
    print_status "Systemd service created and enabled"
    
    echo ""
    echo "You can control the service with:"
    echo "  sudo systemctl start youtube-transcriber    # Start the service"
    echo "  sudo systemctl stop youtube-transcriber     # Stop the service"
    echo "  sudo systemctl status youtube-transcriber   # Check status"
fi

# Get IP address
IP_ADDRESS=$(hostname -I | awk '{print $1}')

echo ""
echo "=================================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=================================================="
echo ""
echo "To start the server manually:"
echo "  1. Activate the virtual environment: source venv/bin/activate"
echo "  2. Run the server: python server.py"
echo ""
echo "The service will be available at:"
echo "  - Local: http://localhost:5000"
echo "  - Network: http://$IP_ADDRESS:5000"
echo ""
echo "Access the web interface from any device on your network!"
echo ""
print_warning "Note: Make sure port 5000 is open in your firewall"
echo "=================================================="
