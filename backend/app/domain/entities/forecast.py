"""Module contenant les entités liées aux prévisions."""

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import List, Optional


class ForecastPeriod(Enum):
    """Énumération des périodes de prévision disponibles."""

    ONE_MONTH = "1m"
    THREE_MONTHS = "3m"
    SIX_MONTHS = "6m"
    ONE_YEAR = "1y"


@dataclass
class DataPoint:
    """Représente un point de données pour les graphiques."""

    date: datetime
    amount: float
    category: Optional[str] = None


@dataclass
class ForecastData:
    """Représente les données agrégées pour les prévisions."""

    user_id: str
    period: ForecastPeriod
    start_date: datetime
    end_date: datetime

    # Données historiques
    expenses_data: List[DataPoint]
    income_data: List[DataPoint]

    # Données prévisionnelles
    forecast_expenses: List[DataPoint]
    forecast_income: List[DataPoint]

    # Totaux agrégés
    total_expenses: float
    total_income: float
    net_balance: float

    # Totaux prévisionnels
    forecast_total_expenses: float
    forecast_total_income: float
    forecast_net_balance: float

    # Métadonnées
    created_at: datetime
    updated_at: datetime
