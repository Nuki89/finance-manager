#!/bin/bash

# Navigate to the app directory
cd /app

# Apply database migrations
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Collect static files (optional for dev)
python manage.py collectstatic --noinput

# Use runserver for dev, gunicorn for prod
if [ "$MODE" = "dev" ]; then
    echo "Running in DEVELOPMENT mode"
    exec python manage.py runserver 0.0.0.0:8000
else
    echo "Running in PRODUCTION mode"
    exec python -m gunicorn core.wsgi:application --bind 0.0.0.0:8088
fi