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
RELEASE_JSON=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" 2>/dev/null || true)
LATEST_TAG=$(echo "$RELEASE_JSON" | grep '"tag_name":' | head -n1 | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$LATEST_TAG" ]; then
  echo "❌ Could not detect latest release version from GitHub (https://github.com/$REPO)."
  echo "💡 Ensure the repository is public and at least one release (e.g. v1.0.0) is published."
  exit 1
fi

URL="https://github.com/$REPO/releases/download/$LATEST_TAG/zenota-${OS}-${ARCH}"

echo "📥 Downloading ZenOTA Server CLI ($LATEST_TAG)..."
curl -fsSL "$URL" -o /tmp/zenota
chmod +x /tmp/zenota
sudo mv /tmp/zenota "$INSTALL_DIR/zenota"

echo "✅ ZenOTA Server CLI installed successfully! Run 'zenota init' to start."
