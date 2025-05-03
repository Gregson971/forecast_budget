"""Cas d'utilisation pour révoquer une session d'un utilisateur."""

from fastapi import HTTPException
from app.domain.interfaces.session_repository_interface import SessionRepository


class RevokeUserSession:
    """Cas d'utilisation pour révoquer une session d'un utilisateur."""

    def __init__(self, session_repository: SessionRepository):
        self.session_repository = session_repository

    def execute(self, session_id: str, user_id: str) -> None:
        """Exécute le cas d'utilisation pour révoquer une session d'un utilisateur."""

        session = self.session_repository.get_by_id(session_id)

        if not session or session.user_id != user_id:
            raise HTTPException(status_code=404, detail="Session non trouvée")

        if session.revoked:
            raise HTTPException(status_code=400, detail="Session déjà revoquée")

        self.session_repository.revoke_by_id(session_id, user_id)
