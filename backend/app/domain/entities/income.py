"""Module contenant les entités liées aux revenus."""

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional


class IncomeCategory(Enum):
    """Énumération des catégories de revenus disponibles."""

    SALARY = "salary"
    FREELANCE = "freelance"
    INVESTMENT = "investment"
    RENTAL = "rental"
    BUSINESS = "business"
    BONUS = "bonus"
    COMMISSION = "commission"
    ROYALTIES = "royalties"
    PENSION = "pension"
    OTHER = "other"


class IncomeFrequency(Enum):
    """Énumération des fréquences de revenus disponibles."""

    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"
    ONE_TIME = "one-time"


@dataclass
class Income:
    """Représente un revenu."""

    id: str
    user_id: str
    name: str
    amount: float
    date: datetime
    created_at: datetime
    updated_at: datetime
    category: Optional[IncomeCategory] = None
    description: Optional[str] = None
    is_recurring: bool = False
    frequency: Optional[IncomeFrequency] = None
