#!/bin/bash

export PATH="/root/.npm-global/bin:$PATH"
cd /app
npm install

if [ "$NODE_ENV" = "production" ]; then
    echo "Running in PRODUCTION mode"  
    exec nginx -g "daemon off;"
else
    echo "Running in DEVELOPMENT mode"
    exec ng serve --host 0.0.0.0 --port 4200
fi