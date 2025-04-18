"""Module principal de l'application."""

from fastapi import FastAPI
from app.infrastructure.db.database import Base, engine
from app.interfaces.api.auth import router

# Création automatique des tables
Base.metadata.create_all(bind=engine)

# Création de l'application FastAPI
app = FastAPI(
    title="Forecast budget API",
    description="API pour l'application de gestion de budget",
    version="1.0.0",
)


@app.get("/")
def read_root():
    """Route pour la racine de l'API."""

    return {"message": "Bienvenue sur l'API de gestion de budget"}


app.include_router(router)
