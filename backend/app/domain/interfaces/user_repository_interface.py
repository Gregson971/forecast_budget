"""Module contenant les interfaces pour les opérations liées aux utilisateurs."""

from abc import ABC, abstractmethod
from app.domain.entities.user import User


class UserRepositoryInterface(ABC):
    """Interface pour les opérations liées aux utilisateurs."""

    @abstractmethod
    def add(self, user: User) -> User:
        """Ajoute un utilisateur."""
        pass

    @abstractmethod
    def get_all(self) -> list[User]:
        """Récupère tous les utilisateurs."""
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> User:
        """Récupère un utilisateur par son email."""
        pass

    @abstractmethod
    def get_by_id(self, user_id: str) -> User:
        """Récupère un utilisateur par son id."""
        pass

    @abstractmethod
    def update(self, user_id: str, user: User) -> User:
        """Met à jour un utilisateur."""
        pass

    @abstractmethod
    def delete(self, user_id: str) -> None:
        """Supprime un utilisateur."""
        pass
