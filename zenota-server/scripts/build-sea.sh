#!/bin/bash
set -e

npm run build
node --experimental-sea-config sea-config.json

# Copy Node.js executable
rm -f zenota
cp $(which node) zenota

npx postject zenota NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

echo "✅ Binary built: ./zenota (Note: postject step may need to be run manually if it fails)"
