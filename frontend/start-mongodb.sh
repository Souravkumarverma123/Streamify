#!/bin/bash

echo "🍃 Starting MongoDB for Chai Video..."
echo "===================================="

# Check if MongoDB is already running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is already running!"
    exit 0
fi

# Try different MongoDB installation methods
echo "🔍 Looking for MongoDB installation..."

# Method 1: Check if mongod is in PATH
if command -v mongod &> /dev/null; then
    echo "✅ Found MongoDB in PATH"
    mongod --dbpath ./data/db --fork --logpath ./mongodb.log
    echo "✅ MongoDB started successfully!"
    echo "📁 Data directory: ./data/db"
    echo "📄 Log file: ./mongodb.log"
    exit 0
fi

# Method 2: Check Homebrew installation
if [ -f "/opt/homebrew/bin/mongod" ]; then
    echo "✅ Found MongoDB via Homebrew"
    /opt/homebrew/bin/mongod --dbpath ./data/db --fork --logpath ./mongodb.log
    echo "✅ MongoDB started successfully!"
    exit 0
fi

# Method 3: Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Using Docker to run MongoDB..."
    docker run -d --name mongodb -p 27017:27017 mongo:latest
    echo "✅ MongoDB started in Docker container!"
    echo "📦 Container name: mongodb"
    echo "🔗 Connection: mongodb://localhost:27017"
    exit 0
fi

# If none of the above work
echo "❌ MongoDB not found. Please install MongoDB:"
echo ""
echo "Option 1: Install via Homebrew (may require Xcode update):"
echo "  brew tap mongodb/brew"
echo "  brew install mongodb-community"
echo ""
echo "Option 2: Use MongoDB Atlas (cloud - recommended):"
echo "  1. Go to https://cloud.mongodb.com"
echo "  2. Create a free account"
echo "  3. Create a new cluster"
echo "  4. Get connection string"
echo "  5. Update chai-backend/env with your connection string"
echo ""
echo "Option 3: Install Docker and run MongoDB:"
echo "  brew install docker"
echo "  docker run -d --name mongodb -p 27017:27017 mongo:latest"
echo ""
echo "Option 4: Download MongoDB Community Server:"
echo "  https://www.mongodb.com/try/download/community"
