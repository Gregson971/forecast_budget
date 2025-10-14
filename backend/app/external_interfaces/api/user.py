"""Module contenant les routes pour les utilisateurs."""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.infrastructure.db.database import SessionLocal
from app.infrastructure.repositories.user_repository import SQLUserRepository
from app.infrastructure.security.dependencies import get_current_user
from app.use_cases.user.get_user import GetUser
from app.use_cases.user.update_user import UpdateUser
from app.use_cases.user.delete_user import DeleteUser
from app.domain.entities.user import User

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


class UpdateUserRequest(BaseModel):
    """Requête pour mettre à jour un utilisateur."""

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None


@user_router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    """Récupère les informations d'un utilisateur."""

    try:
        use_case = GetUser(SQLUserRepository(db))
        user = use_case.execute(user_id)
        return user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@user_router.put("/me", response_model=UserResponse)
def update_current_user(
    data: UpdateUserRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour les informations de l'utilisateur connecté."""

    try:
        # Filtrer les champs non fournis
        update_data = data.model_dump(exclude_none=True)

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Aucune donnée à mettre à jour"
            )

        use_case = UpdateUser(SQLUserRepository(db))
        updated_user = use_case.execute(current_user.id, update_data)

        return updated_user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)) from e


@user_router.delete("/me")
def delete_current_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime le compte de l'utilisateur connecté."""

    try:
        use_case = DeleteUser(SQLUserRepository(db))
        use_case.execute(current_user.id)
        return {"message": "Votre compte a été supprimé avec succès"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
