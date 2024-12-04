#!/bin/bash

# Start Celery worker
celery -A celery_worker.celery worker --loglevel=info &

# Sleep 15s for Celery worker to start
sleep 15

# Migrate database
flask db upgrade

# Start Flask server
python3 run.py