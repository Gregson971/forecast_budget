"""Test pour le cas d'utilisation de liste des dépenses."""

from uuid import uuid4
from datetime import datetime, UTC
from app.domain.entities.expense import Expense
from app.use_cases.expenses.list_expenses import ListExpenses


class InMemoryExpenseRepository:
    """Repository en mémoire pour les dépenses."""

    def __init__(self, expenses):
        self.expenses = expenses

    def get_by_user_id(self, user_id: str) -> list[Expense]:
        """Récupère toutes les dépenses d'un utilisateur."""

        return [expense for expense in self.expenses if expense.user_id == user_id]


def test_list_expense_for_user_success():
    """Test pour le cas d'utilisation de liste des dépenses pour un utilisateur avec succès."""

    user_id = uuid4()
    expenses = [
        Expense(
            id=uuid4(),
            user_id=user_id,
            name="Netflix",
            amount=40.0,
            date=datetime.now(UTC),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        ),
        Expense(
            id=uuid4(),
            user_id=user_id,
            name="Spotify",
            amount=19.0,
            date=datetime.now(UTC),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        ),
    ]
    repo = InMemoryExpenseRepository(expenses)
    use_case = ListExpenses(repo)

    result = use_case.execute(user_id)

    assert len(result) == 2
    assert result[0].name == "Netflix"
    assert result[1].name == "Spotify"
    assert result[0].amount == 40.0
    assert result[1].amount == 19.0


def test_list_expense_for_user_failure():
    """Test pour le cas d'utilisation de liste des dépenses pour un utilisateur avec échec."""

    user_id = uuid4()
    repo = InMemoryExpenseRepository([])
    use_case = ListExpenses(repo)

    result = use_case.execute(user_id)

    assert result == []


def test_list_expense_for_user_failure_with_invalid_user_id():
    """Test pour le cas d'utilisation de
    liste des dépenses pour un utilisateur avec un user_id invalide."""

    user_id = None
    repo = InMemoryExpenseRepository([])
    use_case = ListExpenses(repo)

    result = use_case.execute(user_id)

    assert result == []
