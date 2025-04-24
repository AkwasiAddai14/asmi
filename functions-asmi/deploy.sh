#!/bin/bash

# Stop het script bij de eerste error:
set -e

echo "🚀 Starting full build and deploy process (Functions + Hosting)..."

# Stap 1: Ga naar de juiste directory (pas aan als je structuur anders is)
cd "$(dirname "$0")/functions-asmi"

# Stap 2: Dependencies installeren
echo "📦 Installing dependencies..."
npm install

# Stap 3: Build Next.js app + TypeScript (zorgt voor .next/ folder + compiled lib/)
echo "🛠️  Building Next.js app and TypeScript..."
npm run build

# Stap 4: Terug naar de root folder om deploy te starten
cd ..

# Stap 5: Deploy Functions + Hosting
echo "🚀 Deploying Functions and Hosting to Firebase..."
firebase deploy --only functions:functions-asmi,hosting

echo "✅ Full deploy complete!"
