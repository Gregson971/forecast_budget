"""Interface pour le repository des prévisions."""

from abc import ABC, abstractmethod
from typing import Optional

from app.domain.entities.forecast import ForecastData, ForecastPeriod


class ForecastRepositoryInterface(ABC):
    """Interface définissant les opérations pour les prévisions."""

    @abstractmethod
    def get_forecast_data(self, user_id: str, period: ForecastPeriod) -> Optional[ForecastData]:
        """Récupère les données de prévision pour un utilisateur et une période donnée."""
        pass

    @abstractmethod
    def save_forecast_data(self, forecast_data: ForecastData) -> ForecastData:
        """Sauvegarde les données de prévision (optionnel, pour la mise en cache)."""
        pass
