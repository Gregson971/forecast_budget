"""Module contenant les classes liées aux sessions."""

from dataclasses import dataclass
from datetime import datetime


@dataclass
class Session:
    """Représente une session."""

    id: str
    user_id: str
    refresh_token: str
    user_agent: str
    ip_address: str
    created_at: datetime
    revoked: bool = False


class SessionRepository:
    """Interface pour les opérations liées aux sessions."""

    def add(self, session: Session) -> Session:
        """Ajoute une session à la base de données."""
        pass

    def get_by_refresh_token(self, refresh_token: str) -> Session:
        """Récupère une session par son token de rafraîchissement."""
        pass

    def revoke(self, session_id: str) -> None:
        """Marque une session comme revoquée."""
        pass
