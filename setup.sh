#!/bin/bash

echo "🚀 Setting up AI Agents with Zod project..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
echo "⚙️ Setting up environment..."
cp .env.example .env
echo "Please edit .env file with your GITHUB_TOKEN"

# Build project
echo "🔨 Building project..."
npm run build

echo "✅ Setup complete! Next steps:"
echo "1. Edit .env file with your GitHub token"
echo "2. Run: npm run examples:all"
echo "3. Or run specific examples:"
echo "   - npm run examples:basic"
echo "   - npm run examples:advanced"