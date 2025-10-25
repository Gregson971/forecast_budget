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
from app.infrastructure.security.token_service import TokenService
from app.use_cases.auth.register_user import RegisterUser
from app.use_cases.auth.login_user import LoginUser
from app.use_cases.auth.refresh_token import RefreshToken
from app.use_cases.auth.get_user_sessions import GetUserSessions
from app.use_cases.auth.revoke_user_session import RevokeUserSession
from app.use_cases.auth.request_password_reset import RequestPasswordReset
from app.use_cases.auth.verify_and_reset_password import VerifyAndResetPassword
from app.domain.entities.user import User
from app.infrastructure.repositories.password_reset_code_repository import PasswordResetCodeRepository
from app.infrastructure.sms.sms_service_factory import create_sms_service
from app.infrastructure.security.password_hasher import PasswordHasher

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

    id: str
    first_name: str
    last_name: str
    email: EmailStr
    message: str
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


class RequestPasswordResetRequest(BaseModel):
    """Modèle de requête pour demander la réinitialisation du mot de passe."""

    email: EmailStr | None = None
    phone_number: str | None = None


class RequestPasswordResetResponse(BaseModel):
    """Modèle de réponse pour la demande de réinitialisation."""

    success: bool
    message: str


class VerifyResetCodeRequest(BaseModel):
    """Modèle de requête pour vérifier le code et réinitialiser le mot de passe."""

    code: str
    new_password: str


class VerifyResetCodeResponse(BaseModel):
    """Modèle de réponse pour la vérification du code."""

    success: bool
    message: str


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


@auth_router.delete("/me/sessions/{session_id}")
def revoke_user_session(
    session_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Révoque une session de l'utilisateur connecté."""

    use_case = RevokeUserSession(SQLSessionRepository(db))
    use_case.execute(session_id, current_user.id)

    return {"message": "Session révoquée avec succès"}


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


@auth_router.post("/request-password-reset", response_model=RequestPasswordResetResponse)
async def request_password_reset(
    data: RequestPasswordResetRequest,
    db: Session = Depends(get_db)
):
    """
    Demande un code de réinitialisation de mot de passe.

    Le code sera envoyé par SMS au numéro de téléphone associé au compte.
    Le code expire après 10 minutes.
    """
    try:
        user_repo = SQLUserRepository(db)
        code_repo = PasswordResetCodeRepository(db)
        sms_service = create_sms_service()

        use_case = RequestPasswordReset(user_repo, code_repo, sms_service)
        result = await use_case.execute(
            email=data.email,
            phone_number=data.phone_number
        )

        return result

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur est survenue lors de l'envoi du code"
        ) from e


@auth_router.post("/verify-reset-code", response_model=VerifyResetCodeResponse)
def verify_reset_code(
    data: VerifyResetCodeRequest,
    db: Session = Depends(get_db)
):
    """
    Vérifie le code de réinitialisation et change le mot de passe.

    Le code doit être valide, non expiré et non utilisé.
    Le nouveau mot de passe doit contenir au moins 8 caractères.
    """
    try:
        user_repo = SQLUserRepository(db)
        code_repo = PasswordResetCodeRepository(db)
        password_hasher = PasswordHasher()

        use_case = VerifyAndResetPassword(user_repo, code_repo, password_hasher)
        result = use_case.execute(
            code=data.code,
            new_password=data.new_password
        )

        return result

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur est survenue lors de la réinitialisation"
        ) from e
