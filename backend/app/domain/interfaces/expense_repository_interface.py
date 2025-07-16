"""Module contenant les interfaces pour les opérations liées aux dépenses."""

from abc import ABC, abstractmethod
from app.domain.entities.expense import Expense


class ExpenseRepositoryInterface(ABC):
    """Interface pour les opérations liées aux dépenses."""

    @abstractmethod
    def create(self, expense: Expense) -> Expense:
        """Crée une dépense."""
        pass

    @abstractmethod
    def get_all(self, user_id: str) -> list[Expense]:
        """Récupère toutes les dépenses."""
        pass

    @abstractmethod
    def get_by_id(self, expense_id: str, user_id: str) -> Expense:
        """Récupère une dépense par son id."""
        pass

    @abstractmethod
    def get_by_user_id(self, user_id: str) -> list[Expense]:
        """Récupère toutes les dépenses d'un utilisateur."""
        pass

    @abstractmethod
    def update(self, expense: Expense, user_id: str) -> Expense:
        """Met à jour une dépense."""
        pass

    @abstractmethod
    def delete(self, expense_id: str, user_id: str) -> None:
        """Supprime une dépense."""
        pass
