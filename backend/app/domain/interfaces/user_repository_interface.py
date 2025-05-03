"""Module contenant les interfaces pour les opérations liées aux utilisateurs."""

from abc import ABC, abstractmethod
from app.domain.entities.user import User


class UserRepository(ABC):
    """Interface pour les opérations liées aux utilisateurs."""

    @abstractmethod
    def add(self, user: User) -> User:
        """Ajoute un utilisateur."""
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> User:
        """Récupère un utilisateur par son email."""
        pass

    @abstractmethod
    def get_by_id(self, user_id: str) -> User:
        """Récupère un utilisateur par son id."""
        pass
