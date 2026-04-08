#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend

# Install dependencies
pip install -r requirements.txt

# Create static files directory
mkdir -p staticfiles

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate
