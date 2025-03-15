#!/bin/bash

export PATH="/root/.npm-global/bin:$PATH"

# Navigate to the app directory
cd /app

# Install dependencies
npm install

# Build Angular app if in production mode
if [ "$NODE_ENV" = "production" ]; then
    echo "Running in PRODUCTION mode"
    
    # Start NGINX
    exec nginx -g "daemon off;"
else
    echo "Running in DEVELOPMENT mode"
    
    # Start Angular dev server
    exec ng serve --host 0.0.0.0 --port 4200
fi