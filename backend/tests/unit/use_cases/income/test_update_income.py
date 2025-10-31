"""Tests pour le cas d'usage de mise à jour de revenu."""

import pytest
from datetime import datetime, UTC
from unittest.mock import Mock

from app.domain.entities.income import Income, IncomeCategory, IncomeFrequency
from app.use_cases.income.update_income import UpdateIncome


class TestUpdateIncome:
    """Tests pour le cas d'usage UpdateIncome."""

    def test_update_income_success(self):
        """Test de mise à jour réussie d'un revenu."""
        # Arrange
        mock_repository = Mock()
        use_case = UpdateIncome(mock_repository)

        existing_income = Income(
            id="income-123",
            user_id="user-123",
            name="Salaire mensuel",
            amount=3000.0,
            date=datetime(2024, 1, 15),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
            category=IncomeCategory.SALARY,
            description="Salaire de base",
            is_recurring=True,
            frequency=IncomeFrequency.MONTHLY,
        )

        updated_income = Income(
            id="income-123",
            user_id="user-123",
            name="Salaire mensuel mis à jour",
            amount=3500.0,
            date=datetime(2024, 1, 15),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
            category=IncomeCategory.SALARY,
            description="Salaire de base mis à jour",
            is_recurring=True,
            frequency=IncomeFrequency.MONTHLY,
        )

        mock_repository.update.return_value = updated_income

        # Act
        response = use_case.execute(existing_income, "user-123")

        # Assert
        assert response == updated_income
        mock_repository.update.assert_called_once_with(existing_income)

    def test_update_income_not_found(self):
        """Test de mise à jour d'un revenu inexistant."""
        # Arrange
        mock_repository = Mock()
        use_case = UpdateIncome(mock_repository)

        mock_repository.update.return_value = None

        income = Income(
            id="income-999",
            user_id="user-123",
            name="Nouveau nom",
            amount=3000.0,
            date=datetime(2024, 1, 15),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
            category=IncomeCategory.SALARY,
            description="Description",
            is_recurring=False,
            frequency=None,
        )

        # Act & Assert
        with pytest.raises(ValueError, match="Le revenu n'existe pas ou n'a pas pu être mis à jour"):
            use_case.execute(income, "user-123")

    def test_update_income_partial_update(self):
        """Test de mise à jour partielle d'un revenu."""
        # Arrange
        mock_repository = Mock()
        use_case = UpdateIncome(mock_repository)

        existing_income = Income(
            id="income-123",
            user_id="user-123",
            name="Salaire mensuel",
            amount=3500.0,  # Montant mis à jour
            date=datetime(2024, 1, 15),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
            category=IncomeCategory.SALARY,
            description="Salaire de base",
            is_recurring=True,
            frequency=IncomeFrequency.MONTHLY,
        )

        mock_repository.update.return_value = existing_income

        # Act
        response = use_case.execute(existing_income, "user-123")

        # Assert
        assert response == existing_income
        mock_repository.update.assert_called_once_with(existing_income)

        # Vérifier que le montant a été mis à jour
        updated_income = mock_repository.update.call_args[0][0]
        assert updated_income.amount == 3500.0
        assert updated_income.name == "Salaire mensuel"  # Inchangé

    def test_update_income_validation_failure(self):
        """Test de mise à jour avec validation échouée."""
        # Arrange
        mock_repository = Mock()
        use_case = UpdateIncome(mock_repository)

        # Revenu sans nom (validation échouera)
        income = Income(
            id="income-123",
            user_id="user-123",
            name="",  # Nom vide
            amount=3000.0,
            date=datetime(2024, 1, 15),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
            category=IncomeCategory.SALARY,
            description="Description",
            is_recurring=False,
            frequency=None,
        )

        # Act & Assert
        with pytest.raises(ValueError, match="Le nom est requis"):
            use_case.execute(income, "user-123")

    def test_update_income_empty_user_id(self):
        """Test de mise à jour avec un ID d'utilisateur vide."""
        # Arrange
        mock_repository = Mock()
        use_case = UpdateIncome(mock_repository)

        income = Income(
            id="income-123",
            user_id="user-123",
            name="Salaire mensuel",
            amount=3000.0,
            date=datetime(2024, 1, 15),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
            category=IncomeCategory.SALARY,
            description="Description",
            is_recurring=False,
            frequency=None,
        )

        # Act & Assert
        with pytest.raises(ValueError, match="L'id de l'utilisateur est requis"):
            use_case.execute(income, "")
