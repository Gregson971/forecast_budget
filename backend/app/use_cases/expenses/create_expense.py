"""Module contenant le cas d'utilisation pour créer une dépense."""

import uuid
from datetime import datetime, UTC
from app.domain.entities.expense import Expense, ExpenseCategory, ExpenseFrequency
from app.domain.interfaces.expense_repository_interface import ExpenseRepository


class CreateExpense:
    """Cas d'utilisation pour créer une dépense."""

    def __init__(self, expense_repo: ExpenseRepository):
        self.expense_repo = expense_repo

    def execute(self, expense: Expense) -> Expense | None:
        """Exécute le cas d'utilisation."""

        try:
            self.validate_expense(expense)
            new_expense = Expense(
                id=str(uuid.uuid4()),
                user_id=expense.user_id,
                name=expense.name,
                amount=expense.amount,
                date=expense.date,
                category=expense.category,
                description=expense.description,
                is_recurring=expense.is_recurring,
                frequency=expense.frequency,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
            )
            self.expense_repo.create(new_expense)
            return new_expense
        except ValueError:
            return None

    def validate_expense(self, expense: Expense) -> None:
        """Valide la dépense."""

        if not expense.user_id:
            raise ValueError("L'utilisateur est requis")

        if not expense.name:
            raise ValueError("Le nom est requis")

        if not expense.amount:
            raise ValueError("Le montant est requis")

        if not expense.date:
            raise ValueError("La date est requise")

        if not expense.category:
            raise ValueError("La catégorie est requise")

        if not isinstance(expense.category, ExpenseCategory):
            raise ValueError("La catégorie doit être une valeur valide")

        if expense.frequency and not isinstance(expense.frequency, ExpenseFrequency):
            raise ValueError("La fréquence doit être une valeur valide")

        if expense.is_recurring and not expense.frequency:
            raise ValueError("La fréquence est requise pour une dépense récurrente")
