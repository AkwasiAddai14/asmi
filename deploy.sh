#!/bin/bash

# Exit script bij error:
set -e

echo "🚀 Starting build and deploy process for functions-asmi..."

# Stap 1: Ga naar de juiste map (pas aan als jouw pad anders is)
cd "$(dirname "$0")/functions-asmi"

# Stap 2: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Stap 3: Build Next.js + TypeScript
echo "🛠️  Building Next.js app and TypeScript..."
npm run build

# Stap 4: Deploy naar Firebase (alleen de functions-asmi codebase)
echo "🚀 Deploying to Firebase..."
firebase deploy --only functions:functions-asmi

echo "✅ Deploy complete!"
