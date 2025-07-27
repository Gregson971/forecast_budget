# Utiliser une image Python officielle
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de dépendances
COPY requirements.txt .
COPY alembic.ini .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY app/ app/
COPY migrations/ migrations/
COPY entrypoint.sh .
COPY init_db.py .
COPY run_migrations.py .

# Rendre le script exécutable
RUN chmod +x entrypoint.sh

# Exposer le port
EXPOSE 8000

# Utiliser le script comme point d'entrée
CMD ["./entrypoint.sh"] 