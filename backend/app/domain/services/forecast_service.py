"""Service pour le calcul des prévisions."""

from datetime import datetime, timedelta, UTC
from typing import List
from app.domain.entities.forecast import ForecastData, ForecastPeriod, DataPoint
from app.domain.entities.expense import Expense
from app.domain.entities.income import Income
from app.domain.interfaces.expense_repository_interface import ExpenseRepositoryInterface
from app.domain.interfaces.income_repository_interface import IncomeRepositoryInterface


def ensure_utc(dt):
    """Convertit une date en UTC si elle n'a pas de timezone."""
    if dt.tzinfo is None:
        return dt.replace(tzinfo=UTC)
    return dt.astimezone(UTC)


class ForecastService:
    """Service pour calculer les prévisions financières."""

    def __init__(
        self, expense_repo: ExpenseRepositoryInterface, income_repo: IncomeRepositoryInterface
    ):
        self.expense_repo = expense_repo
        self.income_repo = income_repo

    def calculate_forecast(self, user_id: str, period: ForecastPeriod) -> ForecastData:
        """Calcule les prévisions pour une période donnée."""

        # Déterminer les dates de début et fin
        end_date = datetime.now(UTC)
        start_date = self._get_start_date(end_date, period)

        # Récupérer les données historiques
        expenses = self._get_historical_expenses(user_id, start_date, end_date)
        incomes = self._get_historical_incomes(user_id, start_date, end_date)

        # Agréger les données historiques
        expenses_data = self._aggregate_data(expenses)
        income_data = self._aggregate_data(incomes)

        # Calculer les prévisions
        forecast_expenses = self._calculate_expense_forecast(expenses, period)
        forecast_income = self._calculate_income_forecast(incomes, period)

        # Calculer les totaux
        total_expenses = sum(point.amount for point in expenses_data)
        total_income = sum(point.amount for point in income_data)
        net_balance = total_income - total_expenses

        forecast_total_expenses = sum(point.amount for point in forecast_expenses)
        forecast_total_income = sum(point.amount for point in forecast_income)
        forecast_net_balance = forecast_total_income - forecast_total_expenses

        return ForecastData(
            user_id=user_id,
            period=period,
            start_date=start_date,
            end_date=end_date,
            expenses_data=expenses_data,
            income_data=income_data,
            forecast_expenses=forecast_expenses,
            forecast_income=forecast_income,
            total_expenses=total_expenses,
            total_income=total_income,
            net_balance=net_balance,
            forecast_total_expenses=forecast_total_expenses,
            forecast_total_income=forecast_total_income,
            forecast_net_balance=forecast_net_balance,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

    def _get_start_date(self, end_date: datetime, period: ForecastPeriod) -> datetime:
        """Calcule la date de début basée sur la période."""
        if period == ForecastPeriod.ONE_MONTH:
            return end_date - timedelta(days=30)
        elif period == ForecastPeriod.THREE_MONTHS:
            return end_date - timedelta(days=90)
        elif period == ForecastPeriod.SIX_MONTHS:
            return end_date - timedelta(days=180)
        elif period == ForecastPeriod.ONE_YEAR:
            return end_date - timedelta(days=365)
        else:
            return end_date - timedelta(days=30)

    def _get_historical_expenses(
        self, user_id: str, start_date: datetime, end_date: datetime
    ) -> List[Expense]:
        """Récupère les dépenses historiques."""
        all_expenses = self.expense_repo.get_by_user_id(user_id)
        return [
            expense
            for expense in all_expenses
            if start_date <= ensure_utc(expense.date) <= end_date
        ]

    def _get_historical_incomes(
        self, user_id: str, start_date: datetime, end_date: datetime
    ) -> List[Income]:
        """Récupère les revenus historiques."""
        all_incomes = self.income_repo.get_all_by_user_id(user_id)
        return [
            income for income in all_incomes if start_date <= ensure_utc(income.date) <= end_date
        ]

    def _aggregate_data(self, items: List) -> List[DataPoint]:
        """Agrège les données par date."""
        aggregated = {}

        for item in items:
            date_key = item.date.date()
            if date_key not in aggregated:
                aggregated[date_key] = 0
            aggregated[date_key] += item.amount

        return [
            DataPoint(date=datetime.combine(date, datetime.min.time(), tzinfo=UTC), amount=amount)
            for date, amount in sorted(aggregated.items())
        ]

    def _calculate_expense_forecast(
        self, historical_expenses: List[Expense], period: ForecastPeriod
    ) -> List[DataPoint]:
        """Calcule les prévisions de dépenses."""
        forecast_data = []
        end_date = datetime.now(UTC)

        # Calculer la moyenne mensuelle des dépenses récurrentes
        recurring_expenses = [e for e in historical_expenses if e.is_recurring]
        monthly_average = self._calculate_monthly_average(recurring_expenses)

        # Générer les prévisions pour la période demandée
        months_ahead = self._get_months_ahead(period)

        for i in range(months_ahead):
            forecast_date = end_date + timedelta(days=30 * i)
            forecast_data.append(DataPoint(date=forecast_date, amount=monthly_average))

        return forecast_data

    def _calculate_income_forecast(
        self, historical_incomes: List[Income], period: ForecastPeriod
    ) -> List[DataPoint]:
        """Calcule les prévisions de revenus."""
        forecast_data = []
        end_date = datetime.now(UTC)

        # Calculer la moyenne mensuelle des revenus récurrents
        recurring_incomes = [i for i in historical_incomes if i.is_recurring]
        monthly_average = self._calculate_monthly_average(recurring_incomes)

        # Générer les prévisions pour la période demandée
        months_ahead = self._get_months_ahead(period)

        for i in range(months_ahead):
            forecast_date = end_date + timedelta(days=30 * i)
            forecast_data.append(DataPoint(date=forecast_date, amount=monthly_average))

        return forecast_data

    def _calculate_monthly_average(self, items: List) -> float:
        """Calcule la moyenne mensuelle des montants."""
        if not items:
            return 0.0

        total_amount = sum(item.amount for item in items)
        return total_amount / len(items) if items else 0.0

    def _get_months_ahead(self, period: ForecastPeriod) -> int:
        """Retourne le nombre de mois à prévoir."""
        if period == ForecastPeriod.ONE_MONTH:
            return 1
        elif period == ForecastPeriod.THREE_MONTHS:
            return 3
        elif period == ForecastPeriod.SIX_MONTHS:
            return 6
        elif period == ForecastPeriod.ONE_YEAR:
            return 12
        else:
            return 1
