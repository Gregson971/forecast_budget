"""API pour les prévisions."""

from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.domain.entities.forecast import ForecastPeriod
from app.domain.entities.user import User
from app.infrastructure.db.database import SessionLocal
from app.infrastructure.repositories.expense_repository import SQLExpenseRepository
from app.infrastructure.repositories.income_repository import SQLIncomeRepository
from app.infrastructure.security.dependencies import get_current_user
from app.use_cases.forecast.get_forecast import GetForecast


router = APIRouter(prefix="/forecasts", tags=["forecasts"])


class DataPointResponse(BaseModel):
    """Réponse pour un point de données."""

    date: datetime
    amount: float
    category: str = None


class ForecastDataResponse(BaseModel):
    """Réponse pour les données de prévision."""

    user_id: str
    period: str
    start_date: datetime
    end_date: datetime

    # Données historiques
    expenses_data: List[DataPointResponse]
    income_data: List[DataPointResponse]

    # Données prévisionnelles
    forecast_expenses: List[DataPointResponse]
    forecast_income: List[DataPointResponse]

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


def get_db():
    """Dépendance pour obtenir la session de base de données."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=ForecastDataResponse)
def get_forecast(
    period: str = Query(..., description="Période de prévision (1m, 3m, 6m, 1y)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Récupère les données de prévision pour une période donnée."""

    try:
        # Convertir la période string en enum
        period_enum = ForecastPeriod(period)

        # Initialiser les repositories
        expense_repository = SQLExpenseRepository(db)
        income_repository = SQLIncomeRepository(db)

        # Exécuter le cas d'usage
        use_case = GetForecast(expense_repository, income_repository)
        forecast_data = use_case.execute(current_user.id, period_enum)

        # Convertir en réponse
        return ForecastDataResponse(
            user_id=forecast_data.user_id,
            period=forecast_data.period.value,
            start_date=forecast_data.start_date,
            end_date=forecast_data.end_date,
            expenses_data=[
                DataPointResponse(date=point.date, amount=point.amount, category=point.category)
                for point in forecast_data.expenses_data
            ],
            income_data=[
                DataPointResponse(date=point.date, amount=point.amount, category=point.category)
                for point in forecast_data.income_data
            ],
            forecast_expenses=[
                DataPointResponse(date=point.date, amount=point.amount, category=point.category)
                for point in forecast_data.forecast_expenses
            ],
            forecast_income=[
                DataPointResponse(date=point.date, amount=point.amount, category=point.category)
                for point in forecast_data.forecast_income
            ],
            total_expenses=forecast_data.total_expenses,
            total_income=forecast_data.total_income,
            net_balance=forecast_data.net_balance,
            forecast_total_expenses=forecast_data.forecast_total_expenses,
            forecast_total_income=forecast_data.forecast_total_income,
            forecast_net_balance=forecast_data.forecast_net_balance,
            created_at=forecast_data.created_at,
            updated_at=forecast_data.updated_at,
        )

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors du calcul des prévisions",
        ) from e
