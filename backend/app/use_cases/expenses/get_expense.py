"""Module contenant le cas d'utilisation de récupération d'une dépense."""

from app.domain.interfaces.expense_repository_interface import ExpenseRepositoryInterface
from app.domain.entities.expense import Expense


class GetExpense:
    """Cas d'utilisation de récupération d'une dépense."""

    def __init__(self, expense_repo: ExpenseRepositoryInterface):
        self.expense_repo = expense_repo

    def execute(self, expense_id: str, user_id: str) -> Expense | None:
        """Exécute le cas d'utilisation."""

        try:
            self.validate_expense_id(expense_id, user_id)
            return self.expense_repo.get_by_id(expense_id, user_id)
        except ValueError:
            return None

    def validate_expense_id(self, expense_id: str, user_id: str) -> None:
        """Valide l'id de la dépense."""

        if not expense_id:
            raise ValueError("L'id de la dépense est requis")

        if not user_id:
            raise ValueError("L'id de l'utilisateur est requis")

        if not self.expense_repo.get_by_id(expense_id, user_id):
            raise ValueError("La dépense n'existe pas")
