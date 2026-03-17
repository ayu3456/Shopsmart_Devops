#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up ShopSmart project..."

# Create core directories if they don't exist
mkdir -p shopsmart/src shopsmart/logs

# Function to setup .env if missing
setup_env() {
  local dir=$1
  local env_file="$dir/.env"
  if [ ! -f "$env_file" ]; then
    echo "Creating .env for $dir..."
    touch "$env_file"
    echo "NODE_ENV=development" >> "$env_file"
    echo "PORT=3000" >> "$env_file"
    if [[ "$dir" == "server" ]]; then
       echo "DATABASE_URL=\"file:./dev.db\"" >> "$env_file"
    fi
  else
    echo "✅ .env already exists in $dir"
  fi
}

setup_env "shopsmart"
setup_env "server"

# Check Node.js
if command -v node >/dev/null 2>&1; then
  echo "✅ Node.js installed: $(node -v)"
else
  echo "❌ Node.js not installed"
  exit 1
fi

# Install dependencies if node_modules is missing
for dir in client server; do
  if [ -d "$dir" ]; then
    echo "📦 Checking dependencies for $dir..."
    cd "$dir"
    if [ ! -d "node_modules" ]; then
      npm install
    else
      echo "✅ node_modules already exists in $dir"
    fi
    cd ..
  fi
done

echo "🎉 Setup done!"


