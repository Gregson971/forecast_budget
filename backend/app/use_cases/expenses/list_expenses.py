"""Module contenant le cas d'utilisation pour lister les dépenses."""

from typing import List
from app.domain.entities.expense import Expense
from app.domain.interfaces.expense_repository_interface import ExpenseRepositoryInterface


class ListExpenses:
    """Cas d'utilisation pour lister les dépenses."""

    def __init__(self, expense_repo: ExpenseRepositoryInterface):
        self.expense_repo = expense_repo

    def execute(self, user_id: str) -> List[Expense]:
        """Exécute le cas d'utilisation pour lister les dépenses."""

        try:
            if not user_id:
                raise ValueError("L'utilisateur est requis")
            return self.expense_repo.get_by_user_id(user_id)
        except ValueError:
            return []
