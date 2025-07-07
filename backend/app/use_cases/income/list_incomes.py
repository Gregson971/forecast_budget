"""Cas d'usage pour lister les revenus."""

from typing import List

from app.domain.entities.income import Income
from app.domain.interfaces.income_repository_interface import IncomeRepositoryInterface


class ListIncomes:
    """Cas d'usage pour lister les revenus."""

    def __init__(self, income_repo: IncomeRepositoryInterface):
        self.income_repo = income_repo

    def execute(self, user_id: str) -> List[Income]:
        """Exécute le cas d'usage."""

        try:
            if not user_id:
                raise ValueError("L'utilisateur est requis")
            return self.income_repo.get_all_by_user_id(user_id)
        except ValueError:
            return []
