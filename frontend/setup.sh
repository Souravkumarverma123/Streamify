#!/bin/bash

echo "🚀 Setting up Chai Video - YouTube Clone"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd chai-backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd chai-frontend
npm install
cd ..

echo "✅ Dependencies installed successfully"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB:"
    echo "   Option 1: Install MongoDB Community Edition"
    echo "   Option 2: Use MongoDB Atlas (cloud)"
    echo "   Option 3: Use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
    echo ""
    echo "   For local MongoDB installation:"
    echo "   brew tap mongodb/brew"
    echo "   brew install mongodb-community"
    echo "   brew services start mongodb/brew/mongodb-community"
    echo ""
    echo "   For MongoDB Atlas:"
    echo "   1. Go to https://cloud.mongodb.com"
    echo "   2. Create a free cluster"
    echo "   3. Get connection string"
    echo "   4. Update chai-backend/env file with your connection string"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Start MongoDB (if not already running)"
echo "2. Update environment variables in chai-backend/env"
echo "3. Start backend: cd chai-backend && npm run dev"
echo "4. Start frontend: cd chai-frontend && npm run dev"
echo ""
echo "🌐 Backend will run on: http://localhost:8000"
echo "🌐 Frontend will run on: http://localhost:3000"
echo ""
echo "✨ Setup complete! Happy coding!"
