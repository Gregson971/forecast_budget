"""Module contenant les routes d'authentification."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.infrastructure.db.database import SessionLocal
from app.infrastructure.repositories.user_repository import SQLUserRepository
from app.use_cases.auth.register_user import RegisterUser

router = APIRouter(prefix="/auth", tags=["auth"])


# Dépendance d'injection de session DB
def get_db():
    """Dépendance d'injection de session DB."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class RegisterRequest(BaseModel):
    """Modèle de requête pour l'inscription d'un utilisateur."""

    first_name: str
    last_name: str
    email: EmailStr
    password: str


class RegisterResponse(BaseModel):
    """Modèle de réponse pour l'inscription d'un utilisateur."""

    message: str
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime


@router.post("/register", response_model=RegisterResponse)
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    """Enregistre un nouvel utilisateur."""

    use_case = RegisterUser(SQLUserRepository(db))

    try:
        user = use_case.execute(data.model_dump())
        return {
            "message": "Utilisateur enregistré avec succès",
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e
