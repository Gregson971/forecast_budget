"""Cas d'utilisation pour le rafraîchissement du token d'accès."""

from datetime import timedelta
from fastapi import HTTPException
from app.domain.session import SessionRepository
from app.domain.user import UserRepository
from app.infrastructure.security.token_service import TokenService


class RefreshToken:
    """Cas d'utilisation pour le rafraîchissement du token d'accès."""

    def __init__(self, session_repo: SessionRepository, user_repo: UserRepository):
        self.session_repo = session_repo
        self.user_repo = user_repo

    def refresh_access_token(self, refresh_token: str) -> str:
        """Rafraîchit le token d'accès."""

        session = self.session_repo.get_by_refresh_token(refresh_token)

        if not session or session.revoked:
            raise HTTPException(status_code=401, detail="Session expirée ou invalide")

        user = self.user_repo.get_by_id(session.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable")

        # Option : rotation du refresh_token ici
        return TokenService.create_access_token(
            {"sub": user.id}, expires_delta=timedelta(minutes=15)
        )
