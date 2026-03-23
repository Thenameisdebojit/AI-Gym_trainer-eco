#!/bin/bash
# ───────────────────────────────────────────────────────────────
# FitAI Universal AI Fitness Trainer — APK Build Script
# ───────────────────────────────────────────────────────────────
# Builds a downloadable Android APK via Expo EAS Build (cloud)
# Prerequisites:
#   1. Free Expo account at https://expo.dev/signup
#   2. Run this script once — it guides you through the rest
# ───────────────────────────────────────────────────────────────

set -e

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   FitAI — APK Build via EAS Build Cloud  ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
fi

echo "📋 EAS CLI version: $(eas --version)"
echo ""

# Login check
echo "🔐 Step 1: Log in to your Expo account"
echo "   (Create one free at https://expo.dev/signup)"
echo ""
eas login

echo ""
echo "⚙️  Step 2: Configuring EAS project..."
eas build:configure || true

echo ""
echo "🏗️  Step 3: Building Android APK (Preview build)..."
echo "   This uploads code to Expo's build servers."
echo "   Build takes 5-15 minutes on Expo's free tier."
echo ""
eas build --platform android --profile preview --non-interactive

echo ""
echo "✅ Build submitted! Check build status at: https://expo.dev"
echo ""
echo "Once the build completes:"
echo "  1. Go to https://expo.dev/accounts/[your-username]/projects/fitai-assistant/builds"
echo "  2. Download the .apk file"
echo "  3. Transfer to your Android device and install"
echo "     (Enable 'Unknown sources' in Android Settings → Security)"
echo ""
