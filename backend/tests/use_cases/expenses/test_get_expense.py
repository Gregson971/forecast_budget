"""Module contenant les tests pour le cas d'utilisation de récupération d'une dépense."""

from uuid import uuid4
from datetime import datetime, UTC
from app.domain.entities.expense import Expense
from app.use_cases.expenses.get_expense import GetExpense


class InMemoryExpenseRepository:
    """Repository en mémoire pour les dépenses."""

    def __init__(self):
        self.expenses = {}

    def get_by_id(self, expense_id: str) -> Expense | None:
        """Récupère une dépense par son id."""

        return self.expenses.get(expense_id)


def test_get_expense_success():
    """Test pour le cas d'utilisation de récupération d'une dépense avec succès."""

    user_id = uuid4()
    expense_id = uuid4()
    expense = Expense(
        id=expense_id,
        user_id=user_id,
        name="Transport",
        amount=50.0,
        date=datetime.now(UTC),
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    repo = InMemoryExpenseRepository()
    repo.expenses[expense_id] = expense

    use_case = GetExpense(repo)
    result = use_case.execute(expense_id)

    assert result == expense


def test_get_expense_failure_with_invalid_expense_id():
    """Test pour le cas d'utilisation de récupération d'une dépense avec un id invalide."""

    repo = InMemoryExpenseRepository()
    use_case = GetExpense(repo)

    result = use_case.execute(uuid4())

    assert result is None
