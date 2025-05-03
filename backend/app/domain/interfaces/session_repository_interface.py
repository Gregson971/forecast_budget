"""Module contenant les interfaces pour les opérations liées aux sessions."""

from abc import ABC, abstractmethod
from app.domain.entities.session import Session


class SessionRepository(ABC):
    """Interface pour les opérations liées aux sessions."""

    @abstractmethod
    def add(self, session: Session) -> Session:
        """Ajoute une session à la base de données."""
        pass

    @abstractmethod
    def get_by_refresh_token(self, token: str) -> Session:
        """Récupère une session par son token de rafraîchissement."""
        pass

    @abstractmethod
    def revoke(self, token: str) -> None:
        """Marque une session comme revoquée."""
        pass

    @abstractmethod
    def get_all_by_user_id(self, user_id: str) -> list[Session]:
        """Récupère toutes les sessions d'un utilisateur."""
        pass

    @abstractmethod
    def get_by_id(self, session_id: str) -> Session:
        """Récupère une session par son id."""
        pass

    @abstractmethod
    def revoke_by_id(self, session_id: str, user_id: str) -> None:
        """Marque une session comme revoquée par son id."""
        pass
