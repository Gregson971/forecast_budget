"""Entités pour l'import de transactions."""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional


@dataclass
class ImportedTransaction:
    """Représente une transaction importée depuis un CSV."""

    date: datetime
    description: str
    amount: float
    category: Optional[str] = None
    category_parent: Optional[str] = None
    supplier: Optional[str] = None
    is_expense: bool = True
    is_recurring: bool = False
    account_label: Optional[str] = None


@dataclass
class ImportResult:
    """Résultat d'un import de transactions."""

    total_transactions: int
    expenses_created: int
    incomes_created: int
    errors: List[str]
    skipped: int  # Transactions ignorées (doublons)
    success: bool

    def add_error(self, error: str) -> None:
        """Ajoute une erreur au résultat."""
        self.errors.append(error)
        self.success = False
