#!/bin/bash

# Quick Deploy Script for GitHub Pages
# Usage: ./quick-deploy.sh

set -e

echo "═════════════════════════════════════════"
echo "🚀 Friendly GitHub Pages Deployment"
echo "═════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if git is clean
echo -e "${BLUE}1️⃣  Checking git status...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    echo "Run: git add . && git commit -m 'message'"
    exit 1
fi
echo -e "${GREEN}✓ Git clean${NC}"
echo ""

# Step 2: Check Node.js
echo -e "${BLUE}2️⃣  Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ $NODE_VERSION${NC}"
echo ""

# Step 3: Install dependencies
echo -e "${BLUE}3️⃣  Installing dependencies...${NC}"
npm ci --omit=dev > /dev/null 2>&1 || npm install --omit=dev
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 4: Build
echo -e "${BLUE}4️⃣  Building client...${NC}"
npm run build --workspace client
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Step 5: Show summary
echo "═════════════════════════════════════════"
echo -e "${GREEN}✓ Build successful!${NC}"
echo "═════════════════════════════════════════"
echo ""
echo "📦 Build output: client/dist/"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "2. GitHub Actions will automatically deploy"
echo ""
echo "3. Site will be live at:"
echo "   https://kaanklcrsln.github.io/Friendly/"
echo ""
echo "📊 GitHub Actions Status:"
echo "   https://github.com/kaanklcrsln/Friendly/actions"
echo ""
