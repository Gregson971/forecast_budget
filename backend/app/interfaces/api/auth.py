"""Module contenant les routes d'authentification."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.infrastructure.db.database import SessionLocal
from app.infrastructure.repositories.user_repository import SQLUserRepository
from app.infrastructure.security.dependencies import get_current_user
from app.infrastructure.security.token_service import TokenService
from app.use_cases.auth.register_user import RegisterUser
from app.use_cases.auth.login_user import LoginUser
from app.domain.user import User

auth_router = APIRouter(prefix="/auth", tags=["auth"])


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


class LoginRequest(BaseModel):
    """Modèle de requête pour le login d'un utilisateur."""

    username: EmailStr
    password: str

    @classmethod
    def from_form(cls, form_data: OAuth2PasswordRequestForm) -> "LoginRequest":
        """Crée une instance de LoginRequest à partir d'un formulaire OAuth2."""
        return cls(username=form_data.username, password=form_data.password)


class TokenResponse(BaseModel):
    """Modèle de réponse pour le token d'un utilisateur."""

    access_token: str
    token_type: str = "Bearer"


class FullTokenResponse(BaseModel):
    """Modèle de réponse pour les tokens d'un utilisateur."""

    access_token: str
    refresh_token: str
    token_type: str = "Bearer"


class RefreshTokenRequest(BaseModel):
    """Modèle de requête pour le rafraîchissement d'un token."""

    refresh_token: str


class UserResponse(BaseModel):
    """Modèle de réponse pour l'utilisateur connecté."""

    id: str
    first_name: str
    last_name: str
    email: EmailStr


@auth_router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Récupère les informations de l'utilisateur connecté."""
    return current_user


@auth_router.post("/register", response_model=RegisterResponse)
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
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@auth_router.post("/login", response_model=FullTokenResponse)
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """Login d'un utilisateur."""

    try:
        login_data = LoginRequest.from_form(form_data)
        use_case = LoginUser(SQLUserRepository(db))
        tokens = use_case.execute(login_data.username, login_data.password)
        return tokens

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Vos identifiants sont invalides",
        ) from e


@auth_router.post("/refresh", response_model=TokenResponse)
def refresh_token(data: RefreshTokenRequest):
    """Rafraîchit un token."""

    try:
        payload = TokenService.decode_token(data.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")

        new_access = TokenService.create_access_token(payload)
        return {"access_token": new_access, "token_type": "Bearer"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Impossible de rafraîchir le token",
        ) from e
