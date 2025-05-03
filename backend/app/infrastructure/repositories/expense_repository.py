"""Module contenant le repository pour les opérations liées aux dépenses."""

from sqlalchemy.orm import Session
from app.domain.entities.expense import Expense
from app.domain.interfaces.expense_repository_interface import ExpenseRepository
from app.infrastructure.db.models.expense_db import ExpenseDB


class SQLExpenseRepository(ExpenseRepository):
    """Repository pour les opérations liées aux dépenses."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, expense: Expense) -> Expense:
        """Crée une dépense."""

        expense_db = ExpenseDB(**expense.__dict__)
        self.db.add(expense_db)
        self.db.commit()
        self.db.refresh(expense_db)

        return Expense(**expense_db.__dict__)

    def get_all(self) -> list[Expense]:
        """Récupère toutes les dépenses."""

        expenses = self.db.query(ExpenseDB).all()

        if not expenses:
            return []

        return [Expense(**expense.__dict__) for expense in expenses]

    def get_by_id(self, expense_id: str) -> Expense:
        """Récupère une dépense par son id."""

        expense_db = self.db.query(ExpenseDB).filter(ExpenseDB.id == expense_id).first()

        if not expense_db:
            raise ValueError("Dépense non trouvée")

        return Expense(**expense_db.__dict__)

    def get_by_user_id(self, user_id: str) -> list[Expense]:
        """Récupère toutes les dépenses d'un utilisateur."""

        expenses = self.db.query(ExpenseDB).filter(ExpenseDB.user_id == user_id).all()

        if not expenses:
            return []

        return [Expense(**expense.__dict__) for expense in expenses]

    def update(self, expense: Expense) -> Expense:
        """Met à jour une dépense."""

        expense_db = (
            self.db.query(ExpenseDB)
            .filter(ExpenseDB.id == expense.id, ExpenseDB.user_id == expense.user_id)
            .first()
        )

        if not expense_db:
            raise ValueError("Dépense non trouvée")

        self.db.query(ExpenseDB).filter(
            ExpenseDB.id == expense.id, ExpenseDB.user_id == expense.user_id
        ).update(expense.__dict__)
        self.db.commit()

        return Expense(**expense_db.__dict__)

    def delete(self, expense_id: str, user_id: str) -> None:
        """Supprime une dépense."""
        self.db.query(ExpenseDB).filter(
            ExpenseDB.id == expense_id, ExpenseDB.user_id == user_id
        ).delete()
        self.db.commit()
