#!/bin/bash

echo "🚀 Setting up ShopSmart project..."

# Create directories
mkdir -p shopsmart/src shopsmart/logs

# Create .env file
ENV_FILE="shopsmart/.env"
if [ ! -f "$ENV_FILE" ]; then
  touch "$ENV_FILE"
  echo "NODE_ENV=development" >> "$ENV_FILE"
  echo "PORT=3000" >> "$ENV_FILE"
fi

# Check Node.js
if command -v node >/dev/null 2>&1; then
  echo "✅ Node.js installed:"
  node -v
else
  echo "❌ Node.js not installed"
fi

echo "🎉 Setup done!"


