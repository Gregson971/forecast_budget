"""Tests pour le cas d'utilisation de création d'une dépense."""

from uuid import uuid4
from datetime import datetime, UTC
from app.domain.entities.expense import Expense, ExpenseCategory
from app.use_cases.expenses.create_expense import CreateExpense


class InMemoryExpenseRepository:
    """Repository en mémoire pour les dépenses."""

    def __init__(self):
        self.expenses = []

    def create(self, expense: Expense) -> Expense:
        self.expenses.append(expense)
        return expense


def test_create_expense_success():
    """Test pour le cas d'utilisation de création d'une dépense avec succès."""

    repo = InMemoryExpenseRepository()
    use_case = CreateExpense(repo)

    expense = Expense(
        id=uuid4(),
        user_id=uuid4(),
        name="Test",
        amount=100,
        date=datetime.now(UTC),
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
        category=ExpenseCategory.FOOD,
        description="Test",
        is_recurring=False,
        frequency=None,
    )

    result = use_case.execute(expense)

    assert result is not None
    assert result.id == expense.id
    assert result.user_id == expense.user_id
    assert result.name == expense.name
    assert result.amount == expense.amount
    assert result.date == expense.date
    assert result.category == expense.category
    assert result.description == expense.description
    assert result.is_recurring == expense.is_recurring
    assert result.frequency == expense.frequency


def test_create_expense_with_invalid_user_id():
    """Test pour le cas d'utilisation de création d'une dépense avec un user_id invalide."""

    repo = InMemoryExpenseRepository()
    use_case = CreateExpense(repo)

    expense = Expense(
        id=uuid4(),
        user_id=None,
        name="Test",
        amount=100,
        date=datetime.now(UTC),
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
        category=ExpenseCategory.FOOD,
        description="Test",
        is_recurring=False,
        frequency=None,
    )

    result = use_case.execute(expense)

    assert result is None
