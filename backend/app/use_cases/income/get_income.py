"""Cas d'usage pour récupérer un revenu."""

from app.domain.entities.income import Income
from app.domain.interfaces.income_repository_interface import IncomeRepositoryInterface


class GetIncome:
    """Cas d'usage pour récupérer un revenu."""

    def __init__(self, income_repo: IncomeRepositoryInterface):
        self.income_repo = income_repo

    def execute(self, income_id: str, user_id: str) -> Income | None:
        """Exécute le cas d'usage."""

        try:
            self.validate_income_id(income_id)
            self.validate_user_id(user_id)
            return self.income_repo.get_by_id(income_id, user_id)
        except ValueError:
            return None

    def validate_income_id(self, income_id: str) -> None:
        """Valide l'id du revenu."""

        if not income_id:
            raise ValueError("L'id du revenu est requis")

    def validate_user_id(self, user_id: str) -> None:
        """Valide l'id de l'utilisateur."""

        if not user_id:
            raise ValueError("L'id de l'utilisateur est requis")
