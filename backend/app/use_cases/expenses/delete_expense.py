"""Module contenant le cas d'utilisation de suppression d'une dépense."""

from app.domain.interfaces.expense_repository_interface import ExpenseRepository


class DeleteExpense:
    """Cas d'utilisation de suppression d'une dépense."""

    def __init__(self, expense_repo: ExpenseRepository):
        self.expense_repo = expense_repo

    def execute(self, expense_id: str, user_id: str) -> None:
        """Exécute le cas d'utilisation."""

        try:
            self.validate_expense_id(expense_id)
            self.validate_user_id(user_id)
            self.expense_repo.delete(expense_id, user_id)
        except ValueError:
            return None

    def validate_expense_id(self, expense_id: str) -> None:
        """Valide l'id de la dépense."""

        if not expense_id:
            raise ValueError("L'id de la dépense est requis")

        if not self.expense_repo.get_by_id(expense_id):
            raise ValueError("La dépense n'existe pas")

    def validate_user_id(self, user_id: str) -> None:
        """Valide l'id de l'utilisateur."""

        if not user_id:
            raise ValueError("L'id de l'utilisateur est requis")
