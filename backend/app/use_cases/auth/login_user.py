"""Module contenant le cas d'utilisation de login d'un utilisateur."""

import uuid
from datetime import datetime, UTC
from passlib.hash import bcrypt
from app.domain.interfaces.user_repository_interface import UserRepositoryInterface
from app.domain.entities.token import RefreshToken
from app.domain.interfaces.token_repository_interface import RefreshTokenRepositoryInterface
from app.domain.entities.session import Session
from app.domain.interfaces.session_repository_interface import SessionRepositoryInterface
from app.infrastructure.security.token_service import TokenService


class LoginUser:
    """Cas d'utilisation de login d'un utilisateur."""

    def __init__(
        self,
        user_repo: UserRepositoryInterface,
        refresh_token_repo: RefreshTokenRepositoryInterface,
    ):
        self.user_repo = user_repo
        self.refresh_token_repo = refresh_token_repo

    def execute(self, email: str, password: str) -> str:
        """Exécute le cas d'utilisation de login d'un utilisateur."""

        self.validate_credentials(email, password)

        user = self.user_repo.get_by_email(email)
        payload = {"sub": user.id}

        access_token = TokenService.create_access_token(payload)
        refresh_token = TokenService.create_refresh_token(payload)

        self.refresh_token_repo.add(
            RefreshToken(
                token=refresh_token, user_id=user.id, created_at=datetime.now(UTC), revoked=False
            )
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer",
        }

    def validate_credentials(self, email: str, password: str) -> None:
        """Valide les identifiants d'un utilisateur."""

        user = self.user_repo.get_by_email(email)
        if not user or not bcrypt.verify(password, user.password):
            raise ValueError("Vos identifiants sont invalides")

    def create_session(
        self,
        user_id: str,
        refresh_token: str,
        user_agent: str,
        ip: str,
        repo: SessionRepositoryInterface,
    ) -> None:
        """Crée une session."""

        session = Session(
            id=str(uuid.uuid4()),
            user_id=user_id,
            refresh_token=refresh_token,
            user_agent=user_agent,
            ip_address=ip,
            created_at=datetime.now(UTC),
        )
        repo.add(session)
