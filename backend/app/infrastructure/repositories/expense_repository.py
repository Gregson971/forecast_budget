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
        expense_db = ExpenseDB(
            id=expense.id,
            user_id=expense.user_id,
            name=expense.name,
            amount=expense.amount,
            date=expense.date,
            category=expense.category,
            description=expense.description,
            is_recurring=expense.is_recurring,
            frequency=expense.frequency,
            created_at=expense.created_at,
            updated_at=expense.updated_at,
        )
        self.db.add(expense_db)
        self.db.commit()
        self.db.refresh(expense_db)

        # Filtrer les attributs SQLAlchemy
        expense_dict = {k: v for k, v in expense_db.__dict__.items() if not k.startswith('_')}
        return Expense(**expense_dict)

    def get_all(self, user_id: str) -> list[Expense]:
        """Récupère toutes les dépenses."""

        expenses = self.db.query(ExpenseDB).filter(ExpenseDB.user_id == user_id).all()

        if not expenses:
            return []

        return [
            Expense(
                id=expense.id,
                user_id=expense.user_id,
                name=expense.name,
                amount=expense.amount,
                date=expense.date,
                category=expense.category,
                description=expense.description,
                is_recurring=expense.is_recurring,
                frequency=expense.frequency,
                created_at=expense.created_at,
                updated_at=expense.updated_at,
            )
            for expense in expenses
        ]

    def get_by_id(self, expense_id: str, user_id: str) -> Expense:
        """Récupère une dépense par son id."""

        expense_db = (
            self.db.query(ExpenseDB)
            .filter(ExpenseDB.id == expense_id, ExpenseDB.user_id == user_id)
            .first()
        )

        if not expense_db:
            raise ValueError("Dépense non trouvée")

        return Expense(
            id=expense_db.id,
            user_id=expense_db.user_id,
            name=expense_db.name,
            amount=expense_db.amount,
            date=expense_db.date,
            category=expense_db.category,
            description=expense_db.description,
            is_recurring=expense_db.is_recurring,
            frequency=expense_db.frequency,
            created_at=expense_db.created_at,
            updated_at=expense_db.updated_at,
        )

    def get_by_user_id(self, user_id: str) -> list[Expense]:
        """Récupère toutes les dépenses d'un utilisateur."""

        expenses = self.db.query(ExpenseDB).filter(ExpenseDB.user_id == user_id).all()

        if not expenses:
            return []

        return [
            Expense(
                id=expense.id,
                user_id=expense.user_id,
                name=expense.name,
                amount=expense.amount,
                date=expense.date,
                category=expense.category,
                description=expense.description,
                is_recurring=expense.is_recurring,
                frequency=expense.frequency,
                created_at=expense.created_at,
                updated_at=expense.updated_at,
            )
            for expense in expenses
        ]

    def update(self, expense: Expense, user_id: str) -> Expense:
        """Met à jour une dépense."""

        expense_db = (
            self.db.query(ExpenseDB)
            .filter(ExpenseDB.id == expense.id, ExpenseDB.user_id == user_id)
            .first()
        )

        if not expense_db:
            raise ValueError("Dépense non trouvée")

        self.db.query(ExpenseDB).filter(
            ExpenseDB.id == expense.id, ExpenseDB.user_id == user_id
        ).update(expense.__dict__)
        self.db.commit()

        return Expense(
            id=expense_db.id,
            user_id=expense_db.user_id,
            name=expense_db.name,
            amount=expense_db.amount,
            date=expense_db.date,
            category=expense_db.category,
            description=expense_db.description,
            is_recurring=expense_db.is_recurring,
            frequency=expense_db.frequency,
            created_at=expense_db.created_at,
            updated_at=expense_db.updated_at,
        )

    def delete(self, expense_id: str, user_id: str) -> None:
        """Supprime une dépense."""
        self.db.query(ExpenseDB).filter(
            ExpenseDB.id == expense_id, ExpenseDB.user_id == user_id
        ).delete()
        self.db.commit()
