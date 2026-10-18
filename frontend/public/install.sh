#!/bin/sh
# ZenOTA Server Installer
# Usage: curl -fsSL https://get-zenota.diesestudio.com | sh

set -e

REPO="KamadoSama/OTA_SELF"
INSTALL_DIR="/usr/local/bin"

# Detect OS and architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
case "$ARCH" in
  x86_64) ARCH="x64" ;;
  aarch64|arm64) ARCH="arm64" ;;
esac

if [ "$OS" = "darwin" ]; then OS="macos"; fi

# Fetch latest version tag from GitHub
LATEST_TAG=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$LATEST_TAG" ]; then
  echo "❌ Could not detect latest version. Please check the repository: $REPO"
  exit 1
fi

URL="https://github.com/$REPO/releases/download/$LATEST_TAG/zenota-${OS}-${ARCH}"

echo "📥 Downloading ZenOTA Server CLI ($LATEST_TAG)..."
curl -fsSL "$URL" -o /tmp/zenota
chmod +x /tmp/zenota
sudo mv /tmp/zenota "$INSTALL_DIR/zenota"

echo "✅ ZenOTA Server CLI installed successfully! Run 'zenota init' to start."
