"""Module principal de l'application."""

from fastapi import FastAPI
from app.infrastructure.db.database import Base, engine
from app.interfaces.api.auth import router

# Création automatique des tables
Base.metadata.create_all(bind=engine)

# Création de l'application FastAPI
app = FastAPI()

app.include_router(router)
