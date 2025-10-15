"""Module principal de l'application."""

import os
import json
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.external_interfaces.api.auth import auth_router
from app.external_interfaces.api.user import user_router
from app.external_interfaces.api.expenses import expense_router
from app.external_interfaces.api.income import router as income_router
from app.external_interfaces.api.forecast import router as forecast_router
from app.external_interfaces.api.health import health_router
from app.external_interfaces.api.imports import import_router

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Les tables sont créées par le script d'initialisation
# Base.metadata.create_all(bind=engine)

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
    logger.info(f"CORS origins configured: {origins_allowed}")
except json.JSONDecodeError as e:
    logger.error(f"Failed to parse ORIGINS_ALLOWED: {e}. Using default.")
    origins_allowed = ["http://localhost:3000"]

# Log CORS configuration at startup
logger.info(f"Starting FastAPI with CORS origins: {origins_allowed}")
logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_allowed,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware pour logger les requêtes et les erreurs."""
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logger.error("Erreur lors du traitement de %s: %s", request.url, str(e), exc_info=True)
        return JSONResponse(status_code=500, content={"detail": "Erreur interne du serveur"})


@app.get("/")
def read_root():
    """Route pour la racine de l'API."""

    return {"message": "Bienvenue sur l'API de gestion de budget"}


@app.get("/cors-config")
def get_cors_config():
    """Endpoint de debug pour vérifier la configuration CORS."""
    origins_allowed_str = os.getenv("ORIGINS_ALLOWED", '["http://localhost:3000"]')
    try:
        origins_allowed = json.loads(origins_allowed_str)
    except json.JSONDecodeError:
        origins_allowed = ["http://localhost:3000"]

    return {
        "origins_allowed": origins_allowed,
        "origins_allowed_raw": origins_allowed_str,
        "environment": os.getenv("ENVIRONMENT", "development"),
        "debug": os.getenv("DEBUG", "false")
    }


app.include_router(auth_router)
app.include_router(user_router)
app.include_router(expense_router)
app.include_router(income_router)
app.include_router(forecast_router)
app.include_router(health_router)
app.include_router(import_router)
