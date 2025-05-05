"""Module contenant le cas d'utilisation de mise à jour d'une dépense."""

from app.domain.entities.expense import Expense
from app.domain.interfaces.expense_repository_interface import ExpenseRepository


class UpdateExpense:
    """Cas d'utilisation de mise à jour d'une dépense."""

    def __init__(self, expense_repo: ExpenseRepository):
        self.expense_repo = expense_repo

    def execute(self, expense: Expense) -> Expense | None:
        """Exécute le cas d'utilisation."""

        try:
            self.validate_expense(expense)
            return self.expense_repo.update(expense)
        except ValueError:
            return None

    def validate_expense(self, expense: Expense) -> None:
        """Valide la dépense."""

        if not expense.id:
            raise ValueError("L'id de la dépense est requis")

        if not expense.user_id:
            raise ValueError("L'utilisateur est requis")

        if not expense.name:
            raise ValueError("Le nom de la dépense est requis")

        if not expense.amount:
            raise ValueError("Le montant de la dépense est requis")

        if not expense.date:
            raise ValueError("La date de la dépense est requise")
