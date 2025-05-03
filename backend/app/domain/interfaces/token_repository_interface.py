"""Module contenant les interfaces pour les opérations liées aux tokens."""

from abc import ABC, abstractmethod
from app.domain.entities.token import RefreshToken


class RefreshTokenRepository(ABC):
    """Interface pour les opérations liées aux tokens de rafraîchissement."""

    @abstractmethod
    def add(self, token: RefreshToken) -> RefreshToken:
        """Ajoute un token de rafraîchissement à la base de données."""
        pass

    @abstractmethod
    def revoke(self, token_str: str) -> None:
        """Marque un token de rafraîchissement comme revoqué."""
        pass

    @abstractmethod
    def is_valid(self, token_str: str) -> bool:
        """Vérifie si un token de rafraîchissement est valide."""
        pass

    @abstractmethod
    def get_by_token(self, token: str) -> RefreshToken:
        """Récupère un token de rafraîchissement par son token."""
        pass

    @abstractmethod
    def get_by_user_id(self, user_id: str) -> list[RefreshToken]:
        """Récupère tous les tokens de rafraîchissement d'un utilisateur."""
        pass
