"""Module contenant les entités liées aux dépenses."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


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
    category: Optional[str] = None
    description: Optional[str] = None
    is_recurring: bool = False
    frequency: Optional[str] = None
