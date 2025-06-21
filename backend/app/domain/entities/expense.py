"""Module contenant les entités liées aux dépenses."""

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional


class ExpenseCategory(Enum):
    """Énumération des catégories de dépenses disponibles."""

    FOOD = "food"
    TRANSPORT = "transport"
    ENTERTAINMENT = "entertainment"
    SHOPPING = "shopping"
    HEALTH = "health"
    HOUSING = "housing"
    UTILITIES = "utilities"
    INSURANCE = "insurance"
    SUBSCRIPTIONS = "subscriptions"
    OTHER = "other"


class ExpenseFrequency(Enum):
    """Énumération des fréquences de dépenses disponibles."""

    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"
    ONE_TIME = "one-time"


@dataclass
class Expense:
    """Représente une dépense."""

    id: str
    user_id: str
    name: str
    amount: float
    date: datetime
    created_at: datetime
    updated_at: datetime
    category: Optional[ExpenseCategory] = None
    description: Optional[str] = None
    is_recurring: bool = False
    frequency: Optional[ExpenseFrequency] = None
