"""Interface pour le repository des revenus."""

from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.income import Income


class IncomeRepositoryInterface(ABC):
    """Interface définissant les opérations CRUD pour les revenus."""

    @abstractmethod
    def create(self, income: Income) -> Income:
        """Crée un nouveau revenu."""
        pass

    @abstractmethod
    def get_by_id(self, income_id: str, user_id: str) -> Optional[Income]:
        """Récupère un revenu par son ID et l'ID de l'utilisateur."""
        pass

    @abstractmethod
    def get_all_by_user_id(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Income]:
        """Récupère tous les revenus d'un utilisateur avec pagination."""
        pass

    @abstractmethod
    def update(self, income: Income) -> Optional[Income]:
        """Met à jour un revenu existant."""
        pass

    @abstractmethod
    def delete(self, income_id: str, user_id: str) -> bool:
        """Supprime un revenu."""
        pass
