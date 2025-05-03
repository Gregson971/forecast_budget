"""Module principal de l'application."""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.db.database import Base, engine
from app.external_interfaces.api.auth import auth_router
from app.external_interfaces.api.user import user_router

# Création automatique des tables
Base.metadata.create_all(bind=engine)

# Création de l'application FastAPI
app = FastAPI(
    title="Forecast budget API",
    description="API pour l'application de gestion de budget",
    version="1.0.0",
)

# Configuration CORS
origins_allowed = os.getenv("ORIGINS_ALLOWED")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_allowed,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.get("/")
def read_root():
    """Route pour la racine de l'API."""

    return {"message": "Bienvenue sur l'API de gestion de budget"}


app.include_router(auth_router)
app.include_router(user_router)
