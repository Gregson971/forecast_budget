"""Module contenant les tests pour le cas d'utilisation de mise à jour d'une dépense."""

import pytest
from uuid import uuid4
from datetime import datetime, UTC
from app.domain.entities.expense import Expense
from app.use_cases.expenses.update_expense import UpdateExpense


class InMemoryExpenseRepository:
    """Repository en mémoire pour les dépenses."""

    def __init__(self):
        self.expenses = {}

    def get_by_id(self, expense_id: str, user_id: str) -> Expense | None:
        """Récupère une dépense par son id."""

        expense = self.expenses.get(expense_id)
        if expense and expense.user_id == user_id:
            return expense
        return None

    def update(self, expense: Expense, user_id: str) -> Expense:
        """Mise à jour d'une dépense."""

        if expense.id not in self.expenses:
            raise ValueError("La dépense n'existe pas")

        if expense.user_id != user_id:
            raise ValueError("L'utilisateur n'est pas autorisé à mettre à jour cette dépense")

        self.expenses[expense.id] = expense
        return expense


def test_update_expense_success():
    """Test pour le cas d'utilisation de mise à jour d'une dépense avec succès."""

    user_id = uuid4()
    expense_id = uuid4()
    original_expense = Expense(
        id=expense_id,
        user_id=user_id,
        name="Transport",
        amount=50.0,
        date=datetime.now(UTC),
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    repo = InMemoryExpenseRepository()
    repo.expenses[expense_id] = original_expense

    updated_expense = Expense(
        id=expense_id,
        user_id=user_id,
        name="Transport (métro)",
        amount=60.0,
        date=datetime.now(UTC),
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    use_case = UpdateExpense(repo)
    result = use_case.execute(updated_expense, user_id)

    assert result is not None
    assert result.name == "Transport (métro)"
    assert result.amount == 60.0


def test_update_expense_failure_with_invalid_expense_id():
    """Test pour le cas d'utilisation de mise à jour d'une dépense avec un id invalide."""

    repo = InMemoryExpenseRepository()
    use_case = UpdateExpense(repo)

    user_id = uuid4()
    expense_id = uuid4()
    updated_expense = Expense(
        id=expense_id,
        user_id=user_id,
        name="Transport",
        amount=50.0,
        date=datetime.now(UTC),
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    with pytest.raises(ValueError, match="La dépense n'existe pas"):
        use_case.execute(updated_expense, user_id)
