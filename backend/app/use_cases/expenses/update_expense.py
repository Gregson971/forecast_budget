"""Module contenant le cas d'utilisation de mise à jour d'une dépense."""

from app.domain.entities.expense import Expense, ExpenseCategory, ExpenseFrequency
from app.domain.interfaces.expense_repository_interface import ExpenseRepository


class UpdateExpense:
    """Cas d'utilisation de mise à jour d'une dépense."""

    def __init__(self, expense_repo: ExpenseRepository):
        self.expense_repo = expense_repo

    def execute(self, expense: Expense, user_id: str) -> Expense | None:
        """Exécute le cas d'utilisation."""

        try:
            self.validate_expense(expense)
            self.validate_user_id(user_id)
            return self.expense_repo.update(expense, user_id)
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

        if expense.category and not isinstance(expense.category, ExpenseCategory):
            raise ValueError("La catégorie doit être une valeur valide")

        if expense.frequency and not isinstance(expense.frequency, ExpenseFrequency):
            raise ValueError("La fréquence doit être une valeur valide")

        if expense.is_recurring and not expense.frequency:
            raise ValueError("La fréquence est requise pour une dépense récurrente")

    def validate_user_id(self, user_id: str) -> None:
        """Valide l'id de l'utilisateur."""

        if not user_id:
            raise ValueError("L'id de l'utilisateur est requis")
