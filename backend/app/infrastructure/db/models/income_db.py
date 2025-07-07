"""Modèle de base de données pour les revenus."""

from datetime import datetime, UTC
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Boolean, Enum as SQLEnum
from app.infrastructure.db.database import Base
from app.domain.entities.income import IncomeCategory, IncomeFrequency


def utc_now():
    """Fonction pour obtenir l'heure UTC actuelle."""
    return datetime.now(UTC)


class IncomeDB(Base):
    """Modèle de base de données pour les revenus."""

    __tablename__ = "incomes"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False)
    category = Column(SQLEnum(IncomeCategory), nullable=False)
    description = Column(String)
    is_recurring = Column(Boolean, default=False)
    frequency = Column(SQLEnum(IncomeFrequency))
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC))

    def __repr__(self) -> str:
        """Représentation du revenu."""
        return f"Income(name={self.name}, amount={self.amount}, date={self.date})"
