#!/bin/bash

# macOS Build Diagnostics Script
# This script checks your build environment and identifies common issues

echo "🔍 macOS Build Environment Diagnostics"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check 1: Operating System
echo "📋 Check 1: Operating System"
OS=$(uname -s)
if [ "$OS" == "Darwin" ]; then
    echo -e "${GREEN}✅ macOS detected${NC}"
    echo "   Version: $(sw_vers -productVersion)"
    CAN_BUILD_MACOS=true
else
    echo -e "${RED}❌ Not macOS (detected: $OS)${NC}"
    echo -e "${YELLOW}   ⚠️  You CANNOT build macOS applications on $OS${NC}"
    echo "   📄 See: MACOS-BUILD-INSTRUCTIONS.md"
    CAN_BUILD_MACOS=false
fi
echo ""

# Check 2: Node.js Version
echo "📋 Check 2: Node.js Version"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
    
    # Extract major version
    MAJOR_VERSION=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
    if [ "$MAJOR_VERSION" -ge 20 ]; then
        echo -e "${GREEN}   ✅ Version is >= 20 (recommended)${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Version < 20 (may have compatibility issues)${NC}"
        echo "   📌 Recommended: Node.js 20 or higher"
    fi
else
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "   Install: https://nodejs.org/"
fi
echo ""

# Check 3: npm Version
echo "📋 Check 3: npm Version"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
fi
echo ""

# Check 4: package.json Configuration
echo "📋 Check 4: package.json Configuration"

if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json found${NC}"
    
    # Check postinstall script
    if grep -q '"postinstall"' package.json; then
        echo -e "${GREEN}   ✅ postinstall script exists${NC}"
        POSTINSTALL=$(grep '"postinstall"' package.json | sed 's/.*: *"\(.*\)".*/\1/')
        echo "      Command: $POSTINSTALL"
    else
        echo -e "${RED}   ❌ postinstall script missing${NC}"
        echo "      📌 Add: \"postinstall\": \"electron-builder install-app-deps\""
    fi
    
    # Check optionalDependencies
    if grep -q '"optionalDependencies"' package.json; then
        echo -e "${GREEN}   ✅ optionalDependencies section exists${NC}"
        
        if grep -A 2 '"optionalDependencies"' package.json | grep -q 'dmg-license'; then
            echo -e "${GREEN}      ✅ dmg-license in optionalDependencies${NC}"
        else
            echo -e "${RED}      ❌ dmg-license not found${NC}"
            echo "         📌 Add: \"dmg-license\": \"^1.0.11\""
        fi
    else
        echo -e "${RED}   ❌ optionalDependencies section missing${NC}"
        echo "      📌 Add optionalDependencies with dmg-license"
    fi
else
    echo -e "${RED}❌ package.json not found${NC}"
    echo "   Are you in the project root directory?"
fi
echo ""

# Check 5: node_modules
echo "📋 Check 5: Dependencies Installation"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules directory exists${NC}"
    
    # Check dmg-license installation (only relevant on macOS)
    if [ "$OS" == "Darwin" ]; then
        if [ -d "node_modules/dmg-license" ]; then
            echo -e "${GREEN}   ✅ dmg-license installed${NC}"
        else
            echo -e "${RED}   ❌ dmg-license not installed${NC}"
            echo "      📌 Run: npm install"
        fi
    else
        echo -e "${YELLOW}   ⚠️  dmg-license not checked (not on macOS)${NC}"
        echo "      This is normal on Linux/Windows"
    fi
    
    # Check better-sqlite3
    if [ -d "node_modules/better-sqlite3" ]; then
        echo -e "${GREEN}   ✅ better-sqlite3 installed${NC}"
    else
        echo -e "${RED}   ❌ better-sqlite3 not installed${NC}"
        echo "      📌 Run: npm install"
    fi
    
    # Check electron
    if [ -d "node_modules/electron" ]; then
        echo -e "${GREEN}   ✅ electron installed${NC}"
    else
        echo -e "${RED}   ❌ electron not installed${NC}"
        echo "      📌 Run: npm install"
    fi
else
    echo -e "${RED}❌ node_modules not found${NC}"
    echo "   📌 Run: npm install"
fi
echo ""

# Check 6: Xcode Command Line Tools (macOS only)
if [ "$OS" == "Darwin" ]; then
    echo "📋 Check 6: Xcode Command Line Tools"
    if xcode-select -p &> /dev/null; then
        echo -e "${GREEN}✅ Xcode Command Line Tools installed${NC}"
        echo "   Path: $(xcode-select -p)"
    else
        echo -e "${RED}❌ Xcode Command Line Tools not found${NC}"
        echo "   📌 Run: xcode-select --install"
    fi
    echo ""
fi

# Summary and Recommendations
echo "========================================"
echo "📊 Summary and Recommendations"
echo "========================================"
echo ""

if [ "$CAN_BUILD_MACOS" = true ]; then
    echo -e "${GREEN}✅ You are on macOS - can build macOS applications${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Fix any ❌ items above"
    echo "2. Run: rm -rf node_modules package-lock.json"
    echo "3. Run: npm install"
    echo "4. Run: ./build-macos.sh"
    echo ""
    echo "📄 For detailed instructions, see: MACOS-BUILD-INSTRUCTIONS.md"
else
    echo -e "${RED}⚠️  You are on $OS - CANNOT build macOS applications${NC}"
    echo ""
    echo -e "${YELLOW}What you CAN do:${NC}"
    echo "✅ Develop and test the application: npm run dev"
    echo "✅ Build for your platform: npm run electron:build"
    echo ""
    echo -e "${YELLOW}To build for macOS:${NC}"
    echo "📌 Use a macOS machine (physical or virtual)"
    echo "📌 Use GitHub Actions with macos-latest runner"
    echo "📌 Use a CI/CD service with macOS support"
    echo ""
    echo "📄 For more details, see: MACOS-BUILD-INSTRUCTIONS.md"
fi

echo ""
echo "========================================"
echo "🔗 Documentation Links"
echo "========================================"
echo "📄 MACOS-BUILD-INSTRUCTIONS.md - Complete build guide"
echo "📄 MACOS-BUILD-FIX.md          - Technical details"
echo "📄 MACOS-BUILD-FIX-SUMMARY.md  - Quick reference"
echo "📄 MACOS-BUILD-FIX-INDEX.md    - Documentation index"
echo ""
