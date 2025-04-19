"""Module contenant les classes liées aux utilisateurs."""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime


@dataclass
class User:
    """Représente un utilisateur."""

    id: str
    first_name: str
    last_name: str
    email: str
    password: str
    created_at: datetime
    updated_at: datetime


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
