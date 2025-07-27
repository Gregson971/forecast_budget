#!/bin/sh

# Vérifier si nous sommes sur Railway (avec DATABASE_URL)
if [ -n "$DATABASE_URL" ]; then
    echo "Railway environment detected, skipping PostgreSQL wait..."
    # Sur Railway, la base de données est déjà prête
else
    # Attendre que PostgreSQL soit prêt (pour Docker local)
    echo "Waiting for PostgreSQL..."
    while ! nc -z postgres 5432; do
        sleep 0.1
    done
    echo "PostgreSQL started"
fi

# Initialiser la base de données (créer les tables si nécessaire)
echo "Initializing database..."
python init_db.py

# Exécuter les migrations
echo "Running migrations..."
python run_migrations.py

# Démarrer l'application
echo "Starting application..."

# Déterminer les paramètres de démarrage selon l'environnement
if [ "$DEBUG" = "true" ] && [ "$ENVIRONMENT" = "development" ]; then
    echo "Starting in development mode with reload and debug..."
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --log-level debug
else
    echo "Starting in production mode..."
    # Attendre un peu avant de démarrer pour laisser le temps à la base de données
    sleep 5
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
fi