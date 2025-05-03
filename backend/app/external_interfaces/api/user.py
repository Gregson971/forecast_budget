"""Module contenant les routes pour les utilisateurs."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.infrastructure.db.database import SessionLocal
from app.infrastructure.repositories.user_repository import SQLUserRepository
from app.use_cases.user.get_user import GetUser

user_router = APIRouter(prefix="/users", tags=["users"])


# Dépendance d'injection de session DB
def get_db():
    """Dépendance d'injection de session DB."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class UserResponse(BaseModel):
    """Réponse pour un utilisateur."""

    id: str
    first_name: str
    last_name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime


@user_router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    """Récupère les informations d'un utilisateur."""

    try:
        use_case = GetUser(SQLUserRepository(db))
        user = use_case.execute(user_id)
        return user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
