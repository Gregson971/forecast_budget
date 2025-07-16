"""Cas d'usage pour récupérer les prévisions."""

from app.domain.entities.forecast import ForecastData, ForecastPeriod
from app.domain.services.forecast_service import ForecastService
from app.domain.interfaces.expense_repository_interface import ExpenseRepositoryInterface
from app.domain.interfaces.income_repository_interface import IncomeRepositoryInterface


class GetForecast:
    """Cas d'usage pour récupérer les prévisions."""

    def __init__(
        self, expense_repo: ExpenseRepositoryInterface, income_repo: IncomeRepositoryInterface
    ):
        self.forecast_service = ForecastService(expense_repo, income_repo)

    def execute(self, user_id: str, period: ForecastPeriod) -> ForecastData:
        """Exécute le cas d'usage."""

        if not user_id:
            raise ValueError("L'utilisateur est requis")

        if not period:
            raise ValueError("La période est requise")

        return self.forecast_service.calculate_forecast(user_id, period)
