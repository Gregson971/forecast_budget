"""Cas d'usage pour supprimer un revenu."""

from app.domain.interfaces.income_repository_interface import IncomeRepositoryInterface


class DeleteIncome:
    """Cas d'usage pour supprimer un revenu."""

    def __init__(self, income_repo: IncomeRepositoryInterface):
        self.income_repo = income_repo

    def execute(self, income_id: str, user_id: str) -> None:
        """Exécute le cas d'usage."""

        try:
            self.validate_user_id(user_id)
            self.validate_income_id(income_id, user_id)
            self.income_repo.delete(income_id, user_id)
        except ValueError:
            return None

    def validate_income_id(self, income_id: str, user_id: str) -> None:
        """Valide l'id du revenu."""

        if not income_id:
            raise ValueError("L'id du revenu est requis")

        if not self.income_repo.get_by_id(income_id, user_id):
            raise ValueError("Le revenu n'existe pas")

    def validate_user_id(self, user_id: str) -> None:
        """Valide l'id de l'utilisateur."""

        if not user_id:
            raise ValueError("L'id de l'utilisateur est requis")
