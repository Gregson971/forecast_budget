"""Module contenant les modèles liés aux dépenses."""

from datetime import datetime, UTC
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Boolean, Enum as SQLEnum
from app.infrastructure.db.database import Base
from app.domain.entities.expense import ExpenseCategory, ExpenseFrequency


class ExpenseDB(Base):
    """Représente une dépense dans la base de données."""

    __tablename__ = "expenses"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False)
    category = Column(SQLEnum(ExpenseCategory), nullable=False)
    description = Column(String)
    is_recurring = Column(Boolean, default=False)
    frequency = Column(SQLEnum(ExpenseFrequency))
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC))

    def __repr__(self) -> str:
        """Représentation de la dépense."""
        return f"Expense(name={self.name}, amount={self.amount}, date={self.date})"
