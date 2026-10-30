#!/bin/bash
# Test de comparaison entre NestJS (port 4001) et Rust Edge (port 4002)

APP_ID="${1:-artisanHub}"
RUNTIME="${2:-1.0.0}"
PLATFORM="${3:-android}"

echo "=========================================="
echo "1. Healthcheck Rust Edge (:4002)"
echo "=========================================="
curl -s http://localhost:4002/health | jq . || curl -s http://localhost:4002/health
echo ""

echo "=========================================="
echo "2. En-têtes HTTP de NestJS (:4001)"
echo "=========================================="
curl -s -D - -o /dev/null \
  -H "expo-runtime-version: $RUNTIME" \
  -H "expo-platform: $PLATFORM" \
  -H "expo-channel-name: production" \
  http://localhost:4001/api/update/manifest/$APP_ID

echo ""
echo "=========================================="
echo "3. En-têtes HTTP de Rust Edge (:4002)"
echo "=========================================="
curl -s -D - -o /dev/null \
  -H "expo-runtime-version: $RUNTIME" \
  -H "expo-platform: $PLATFORM" \
  -H "expo-channel-name: production" \
  http://localhost:4002/api/update/manifest/$APP_ID
echo ""

