#!/bin/sh

# Attendre que PostgreSQL soit prêt
echo "Waiting for PostgreSQL..."
while ! nc -z postgres 5432; do
    sleep 0.1
done
echo "PostgreSQL started"

# Exécuter les migrations
echo "Running migrations..."
alembic upgrade head

# Démarrer l'application
echo "Starting application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 