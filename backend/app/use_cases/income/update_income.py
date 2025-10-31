"""Cas d'usage pour mettre à jour un revenu."""

from app.domain.entities.income import Income, IncomeCategory, IncomeFrequency
from app.domain.interfaces.income_repository_interface import IncomeRepositoryInterface


class UpdateIncome:
    """Cas d'usage pour mettre à jour un revenu."""

    def __init__(self, income_repo: IncomeRepositoryInterface):
        self.income_repo = income_repo

    def execute(self, income: Income, user_id: str) -> Income:
        """Exécute le cas d'usage."""

        # Forcer la cohérence de is_recurring
        if income.frequency and income.frequency != IncomeFrequency.ONE_TIME:
            income.is_recurring = True
        else:
            income.is_recurring = False

        self.validate_income(income)
        self.validate_user_id(user_id)
        updated_income = self.income_repo.update(income)
        if not updated_income:
            raise ValueError("Le revenu n'existe pas ou n'a pas pu être mis à jour")
        return updated_income

    def validate_income(self, income: Income) -> None:
        """Valide le revenu."""

        if not income.id:
            raise ValueError("L'id du revenu est requis")

        if not income.user_id:
            raise ValueError("L'utilisateur est requis")

        if not income.name:
            raise ValueError("Le nom est requis")

        if not income.amount:
            raise ValueError("Le montant est requis")

        if not income.date:
            raise ValueError("La date est requise")

        if income.category and not isinstance(income.category, IncomeCategory):
            raise ValueError("La catégorie doit être une valeur valide")

        if income.frequency and not isinstance(income.frequency, IncomeFrequency):
            raise ValueError("La fréquence doit être une valeur valide")

        if income.is_recurring and not income.frequency:
            raise ValueError("La fréquence est requise pour un revenu récurrent")

    def validate_user_id(self, user_id: str) -> None:
        """Valide l'id de l'utilisateur."""

        if not user_id:
            raise ValueError("L'id de l'utilisateur est requis")
