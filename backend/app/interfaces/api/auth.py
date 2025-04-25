"""Module contenant les routes d'authentification."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.infrastructure.db.database import SessionLocal
from app.infrastructure.repositories.user_repository import SQLUserRepository
from app.infrastructure.repositories.refresh_token_repository import SQLRefreshTokenRepository
from app.infrastructure.repositories.session_repository import SQLSessionRepository
from app.infrastructure.security.dependencies import get_current_user
from app.use_cases.auth.register_user import RegisterUser
from app.use_cases.auth.login_user import LoginUser
from app.use_cases.auth.refresh_token import RefreshToken
from app.use_cases.auth.get_user_sessions import GetUserSessions
from app.domain.user import User
from app.infrastructure.security.token_service import TokenService

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


class LogoutRequest(BaseModel):
    """Modèle de requête pour le logout d'un utilisateur."""

    refresh_token: str


@auth_router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """Récupère les informations de l'utilisateur connecté."""
    return current_user


@auth_router.get("/me/sessions")
def list_user_sessions(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Récupère toutes les sessions de l'utilisateur connecté."""

    use_case = GetUserSessions(SQLSessionRepository(db))
    return use_case.execute(current_user.id)


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
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Login d'un utilisateur."""

    try:
        login_data = LoginRequest.from_form(form_data)
        use_case = LoginUser(SQLUserRepository(db), SQLRefreshTokenRepository(db))
        tokens = use_case.execute(login_data.username, login_data.password)

        # Récupérer l'ID de l'utilisateur à partir du token
        payload = TokenService.decode_token(tokens["access_token"])
        user_id = payload["sub"]

        use_case.create_session(
            user_id=user_id,
            refresh_token=tokens["refresh_token"],
            user_agent=request.headers.get("user-agent", ""),
            ip=request.client.host,
            repo=SQLSessionRepository(db),
        )

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
def refresh_token(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Rafraîchit un token."""

    try:
        use_case = RefreshToken(SQLSessionRepository(db), SQLUserRepository(db))
        token = use_case.refresh_access_token(data.refresh_token)

        return {"access_token": token, "token_type": "Bearer"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Votre session est expirée ou invalide",
        ) from e


@auth_router.post("/logout")
def logout_user(data: LogoutRequest, db: Session = Depends(get_db)):
    """Déconnecte un utilisateur."""

    token_repo = SQLRefreshTokenRepository(db)
    token_repo.revoke(data.refresh_token)
    return {"message": "Déconnexion réussie"}
