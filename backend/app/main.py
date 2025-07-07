"""Module principal de l'application."""

import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.db.database import Base, engine
from app.external_interfaces.api.auth import auth_router
from app.external_interfaces.api.user import user_router
from app.external_interfaces.api.expenses import expense_router
from app.external_interfaces.api.income import router as income_router

# Création automatique des tables
Base.metadata.create_all(bind=engine)

# Création de l'application FastAPI
app = FastAPI(
    title="Forecast budget API",
    description="API pour l'application de gestion de budget",
    version="1.0.0",
)

# Configuration CORS
origins_allowed_str = os.getenv("ORIGINS_ALLOWED", '["http://localhost:3000"]')
try:
    origins_allowed = json.loads(origins_allowed_str)
except json.JSONDecodeError:
    origins_allowed = ["http://localhost:3000"]

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
app.include_router(expense_router)
app.include_router(income_router)
