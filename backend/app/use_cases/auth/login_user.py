"""Module contenant le cas d'utilisation de login d'un utilisateur."""

from passlib.hash import bcrypt
from app.domain.user import UserRepository
from app.infrastructure.security.token_service import TokenService


class LoginUser:
    """Cas d'utilisation de login d'un utilisateur."""

    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def execute(self, email: str, password: str) -> str:
        """Exécute le cas d'utilisation de login d'un utilisateur."""

        self.validate_credentials(email, password)

        user = self.user_repo.get_by_email(email)
        payload = {"sub": user.id}

        return {
            "access_token": TokenService.create_access_token(payload),
            "refresh_token": TokenService.create_refresh_token(payload),
            "token_type": "Bearer",
        }

    def validate_credentials(self, email: str, password: str) -> None:
        """Valide les identifiants d'un utilisateur."""

        user = self.user_repo.get_by_email(email)
        if not user or not bcrypt.verify(password, user.password):
            raise ValueError("Vos identifiants sont invalides")
