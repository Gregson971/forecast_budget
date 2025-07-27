"""Module contenant les routes de health check."""

import logging
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy import text
from app.infrastructure.db.database import engine

# Configuration du logging
logger = logging.getLogger(__name__)

health_router = APIRouter(prefix="/health", tags=["health"])


@health_router.get("")
def health_check():
    """Endpoint de healthcheck pour Railway."""
    try:
        # Vérifier la connexion à la base de données
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            connection.commit()

        return {
            "status": "healthy",
            "message": "Application et base de données opérationnelles",
            "timestamp": "2024-01-01T00:00:00Z",
        }
    except Exception as e:
        logger.error(f"Healthcheck failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "message": "Service indisponible", "error": str(e)},
        )
