#!/usr/bin/env python3
"""Script de migration robuste pour Railway."""

import os
import sys
import time
import logging
from alembic.config import Config
from alembic import command
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def wait_for_database(max_retries=30, delay=2):
    """Attendre que la base de données soit disponible."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        logger.error("DATABASE_URL environment variable is not set")
        return False

    # Correction pour Railway/Heroku PostgreSQL
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    engine = create_engine(database_url)

    for attempt in range(max_retries):
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
                logger.info("Database is ready")
                return True
        except OperationalError as e:
            logger.warning(f"Database not ready (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                time.sleep(delay)
            else:
                logger.error("Database connection failed after all retries")
                return False

    return False


def run_migrations():
    """Exécuter les migrations Alembic."""
    try:
        # Attendre que la base de données soit prête
        if not wait_for_database():
            return False

        # Configuration Alembic
        alembic_cfg = Config("alembic.ini")

        # Exécuter les migrations
        logger.info("Running database migrations...")
        command.upgrade(alembic_cfg, "head")
        logger.info("Migrations completed successfully")

        return True

    except Exception as e:
        logger.error(f"Migration failed: {e}")
        return False


if __name__ == "__main__":
    success = run_migrations()
    if not success:
        sys.exit(1)
    logger.info("Migration process completed successfully")
