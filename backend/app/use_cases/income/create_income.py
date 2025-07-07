"""Cas d'usage pour créer un revenu."""

from datetime import datetime, UTC

from app.domain.entities.income import Income, IncomeCategory, IncomeFrequency
from app.domain.interfaces.income_repository_interface import IncomeRepositoryInterface


class CreateIncome:
    """Cas d'usage pour créer un revenu."""

    def __init__(self, income_repo: IncomeRepositoryInterface):
        self.income_repo = income_repo

    def execute(self, income: Income) -> Income | None:
        """Exécute le cas d'usage."""

        try:
            self.validate_income(income)
            # Déterminer si le revenu est récurrent basé sur la fréquence
            if income.frequency and income.frequency != IncomeFrequency.ONE_TIME:
                income.is_recurring = True
            else:
                income.is_recurring = False

            new_income = Income(
                id=income.id,
                user_id=income.user_id,
                name=income.name,
                amount=income.amount,
                date=income.date,
                category=income.category,
                description=income.description,
                is_recurring=income.is_recurring,
                frequency=income.frequency,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
            )
            self.income_repo.create(new_income)
            return new_income
        except ValueError:
            return None

    def validate_income(self, income: Income) -> None:
        """Valide le revenu."""

        if not income.user_id:
            raise ValueError("L'utilisateur est requis")

        if not income.name:
            raise ValueError("Le nom est requis")

        if not income.amount:
            raise ValueError("Le montant est requis")

        if not income.date:
            raise ValueError("La date est requise")

        if not income.category:
            raise ValueError("La catégorie est requise")

        if not isinstance(income.category, IncomeCategory):
            raise ValueError("La catégorie doit être une valeur valide")

        if income.frequency and not isinstance(income.frequency, IncomeFrequency):
            raise ValueError("La fréquence doit être une valeur valide")

        # Vérifier que si le revenu est marqué comme récurrent, il a une fréquence
        if income.is_recurring and not income.frequency:
            raise ValueError("La fréquence est requise pour un revenu récurrent")
