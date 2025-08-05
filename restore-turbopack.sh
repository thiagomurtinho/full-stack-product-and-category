#!/bin/bash

echo "🔄 Restoring Turbopack configuration..."

cd web

if [ -f package.json.backup ]; then
    echo "📋 Restoring original package.json..."
    cp package.json.backup package.json
    echo "✅ Turbopack restored! You can now use 'next dev --turbopack' again."
else
    echo "❌ No backup found. Manually edit web/package.json to change 'next dev' to 'next dev --turbopack'"
fi

cd ..

echo "🎯 To start with Turbopack:"
echo "pnpm dev:web" 