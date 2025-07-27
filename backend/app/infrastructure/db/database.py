"""Configuration de la base de données SQLAlchemy."""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()


def get_database_url():
    """Récupère et configure l'URL de la base de données."""
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        raise ValueError("DATABASE_URL environment variable is not set")

    # Correction pour Railway/Heroku PostgreSQL
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    return database_url


DATABASE_URL = get_database_url()

# Configuration du moteur avec des paramètres optimisés pour la production
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Vérifie la connexion avant utilisation
    pool_recycle=300,  # Recycle les connexions toutes les 5 minutes
    pool_size=10,  # Taille du pool de connexions
    max_overflow=20,  # Connexions supplémentaires autorisées
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
metadata = Base.metadata
