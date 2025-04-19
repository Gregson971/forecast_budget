"""Module contenant le cas d'utilisation de login d'un utilisateur."""

from datetime import datetime
from passlib.hash import bcrypt
from app.domain.user import UserRepository
from app.domain.token import RefreshTokenRepository, RefreshToken
from app.infrastructure.security.token_service import TokenService


class LoginUser:
    """Cas d'utilisation de login d'un utilisateur."""

    def __init__(self, user_repo: UserRepository, refresh_token_repo: RefreshTokenRepository):
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
                token=refresh_token, user_id=user.id, created_at=datetime.now(), revoked=False
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
