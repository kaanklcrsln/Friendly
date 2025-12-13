#!/bin/bash

# GitHub Pages Deploy Script for Friendly

echo "🔨 Building project..."
npm run build --workspace client

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📦 Built files are in: client/dist"
echo ""
echo "Next steps:"
echo "1. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Deploy to GitHub Pages'"
echo "   git push origin main"
echo ""
echo "2. GitHub Actions will automatically deploy to:"
echo "   https://kaanklcrsln.github.io/Friendly/"
echo ""
echo "Or deploy manually using gh-pages package:"
echo "   npx gh-pages -d client/dist"
