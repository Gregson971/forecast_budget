"""Module contenant les classes liées aux tokens."""

from dataclasses import dataclass
from datetime import datetime


@dataclass
class RefreshToken:
    """Représente un token."""

    token: str
    user_id: str
    created_at: datetime
    revoked: bool


class RefreshTokenRepository:
    """Interface pour les opérations liées aux tokens de rafraîchissement."""

    def add(self, token: RefreshToken) -> RefreshToken:
        """Ajoute un token de rafraîchissement à la base de données."""
        pass

    def revoke(self, token_str: str) -> None:
        """Marque un token de rafraîchissement comme revoqué."""
        pass

    def is_valid(self, token_str: str) -> bool:
        """Vérifie si un token de rafraîchissement est valide."""
        pass
