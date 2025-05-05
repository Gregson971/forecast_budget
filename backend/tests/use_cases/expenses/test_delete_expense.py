"""Module contenant les tests pour le cas d'utilisation de suppression d'une dépense."""

from uuid import uuid4
from datetime import datetime, UTC
from app.domain.entities.expense import Expense
from app.use_cases.expenses.delete_expense import DeleteExpense


class InMemoryExpenseRepository:
    """Repository en mémoire pour les dépenses."""

    def __init__(self):
        self.expenses = {}

    def get_by_id(self, expense_id: str) -> Expense | None:
        """Récupère une dépense par son id."""

        return self.expenses.get(expense_id)

    def delete(self, expense_id: str) -> None:
        """Supprime une dépense."""

        if expense_id not in self.expenses:
            raise ValueError("La dépense n'existe pas")

        del self.expenses[expense_id]


def test_delete_expense_success():
    """Test pour le cas d'utilisation de suppression d'une dépense avec succès."""

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

    use_case = DeleteExpense(repo)
    use_case.execute(expense_id)

    assert expense_id not in repo.expenses


def test_delete_expense_failure_with_invalid_expense_id():
    """Test pour le cas d'utilisation de suppression d'une dépense avec un id invalide."""

    repo = InMemoryExpenseRepository()
    use_case = DeleteExpense(repo)

    use_case.execute(uuid4())

    assert not repo.expenses
