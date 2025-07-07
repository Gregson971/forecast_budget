"""Implémentation du repository des revenus (synchrone)."""

from sqlalchemy.orm import Session
from app.domain.entities.income import Income
from app.domain.interfaces.income_repository_interface import IncomeRepositoryInterface
from app.infrastructure.db.models.income_db import IncomeDB


class SQLIncomeRepository(IncomeRepositoryInterface):
    """Repository pour les opérations liées aux revenus."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, income: Income) -> Income:
        """Crée un revenu."""
        income_db = IncomeDB(
            id=income.id,
            user_id=income.user_id,
            name=income.name,
            amount=income.amount,
            date=income.date,
            category=income.category,
            description=income.description,
            is_recurring=income.is_recurring,
            frequency=income.frequency,
            created_at=income.created_at,
            updated_at=income.updated_at,
        )
        self.db.add(income_db)
        self.db.commit()
        self.db.refresh(income_db)
        return Income(**{k: v for k, v in income_db.__dict__.items() if not k.startswith('_')})

    def get_by_id(self, income_id: str, user_id: str) -> Income | None:
        """Récupère un revenu par son id et user_id."""
        income_db = (
            self.db.query(IncomeDB)
            .filter(IncomeDB.id == income_id, IncomeDB.user_id == user_id)
            .first()
        )
        if not income_db:
            return None
        return Income(**{k: v for k, v in income_db.__dict__.items() if not k.startswith('_')})

    def get_all_by_user_id(self, user_id: str, skip: int = 0, limit: int = 100) -> list[Income]:
        """Récupère tous les revenus d'un utilisateur avec pagination."""
        incomes_db = (
            self.db.query(IncomeDB)
            .filter(IncomeDB.user_id == user_id)
            .order_by(IncomeDB.date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        return [
            Income(**{k: v for k, v in income_db.__dict__.items() if not k.startswith('_')})
            for income_db in incomes_db
        ]

    def update(self, income: Income) -> Income | None:
        """Met à jour un revenu existant."""
        income_db = (
            self.db.query(IncomeDB)
            .filter(IncomeDB.id == income.id, IncomeDB.user_id == income.user_id)
            .first()
        )
        if not income_db:
            return None

        for attr, value in income.__dict__.items():
            if hasattr(income_db, attr):
                setattr(income_db, attr, value)
        self.db.commit()
        self.db.refresh(income_db)
        return Income(**{k: v for k, v in income_db.__dict__.items() if not k.startswith('_')})

    def delete(self, income_id: str, user_id: str) -> bool:
        """Supprime un revenu."""
        income_db = (
            self.db.query(IncomeDB)
            .filter(IncomeDB.id == income_id, IncomeDB.user_id == user_id)
            .first()
        )
        if not income_db:
            return False
        self.db.delete(income_db)
        self.db.commit()
        return True
