#!/bin/bash
# Job Application Tracker - Deployment Quick Start
# This script helps prepare the project for deployment to Vercel & Render

echo "=========================================="
echo "Job Application Tracker - Deployment Setup"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "DEPLOYMENT.md" ]; then
    echo "❌ Error: Please run this from the project root directory"
    exit 1
fi

echo "✓ Project directory verified"
echo ""

# Step 1: Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git config user.name "Your Name"
    git config user.email "your.email@gmail.com"
    echo "✓ Git initialized"
else
    echo "✓ Git repository already exists"
fi

echo ""

# Step 2: Add all files
echo "📝 Staging files for commit..."
git add .
echo "✓ Files staged"

echo ""

# Step 3: Create initial commit
if [ -z "$(git log --oneline 2>/dev/null | head -1)" ]; then
    echo "💾 Creating initial commit..."
    git commit -m "Initial commit: Full-stack job application tracker with all features"
    echo "✓ Initial commit created"
else
    echo "ℹ️  Repository already has commits"
fi

echo ""

# Step 4: Set main branch
echo "🌿 Setting main branch..."
git branch -M main
echo "✓ Main branch set"

echo ""
echo "=========================================="
echo "✅ Repository Ready for Deployment!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Create a GitHub repository at https://github.com/new"
echo ""
echo "2. Push your code:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/job-application-tracker.git"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Render:"
echo "   - Create PostgreSQL database"
echo "   - Deploy backend web service"
echo "   - Set environment variables from DEPLOYMENT.md"
echo ""
echo "4. Deploy to Vercel:"
echo "   - Connect GitHub repository"
echo "   - Set VITE_API_BASE environment variable"
echo "   - Deploy"
echo ""
echo "5. Verify deployment:"
echo "   - Test frontend: https://your-app.vercel.app"
echo "   - Test backend: https://your-api.onrender.com/health"
echo ""
echo "For detailed instructions, see LIVE_DEPLOYMENT_GUIDE.md"
echo ""
