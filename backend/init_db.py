#!/usr/bin/env python3
"""Script d'initialisation de la base de données pour Railway."""

import os
import sys
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_database():
    """Initialise la base de données sur Railway."""
    try:
        # Récupérer l'URL de la base de données
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            logger.error("DATABASE_URL environment variable is not set")
            return False

        # Correction pour Railway/Heroku PostgreSQL
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)

        logger.info("Connecting to database...")

        # Créer le moteur de base de données
        engine = create_engine(database_url)

        # Tester la connexion
        with engine.connect() as connection:
            # Vérifier si la base de données existe et est accessible
            connection.execute(text("SELECT 1"))
            logger.info("Database connection successful")

            # Créer les tables si elles n'existent pas
            from app.infrastructure.db.database import Base

            Base.metadata.create_all(bind=engine)
            logger.info("Database tables created successfully")

        return True

    except OperationalError as e:
        logger.error(f"Database connection failed: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error during database initialization: {e}")
        return False


if __name__ == "__main__":
    success = init_database()
    if not success:
        sys.exit(1)
    logger.info("Database initialization completed successfully")
