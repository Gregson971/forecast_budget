"""Tests pour le cas d'usage de récupération de revenu."""

from datetime import datetime, UTC
from unittest.mock import Mock

from app.domain.entities.income import Income, IncomeCategory
from app.use_cases.income.get_income import GetIncome


class TestGetIncome:
    """Tests pour le cas d'usage GetIncome."""

    def test_get_income_success(self):
        """Test de récupération réussie d'un revenu."""
        # Arrange
        mock_repository = Mock()
        use_case = GetIncome(mock_repository)

        expected_income = Income(
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
            frequency=None,
        )
        mock_repository.get_by_id.return_value = expected_income

        # Act
        response = use_case.execute("income-123", "user-123")

        # Assert
        assert response == expected_income
        mock_repository.get_by_id.assert_called_once_with("income-123", "user-123")

    def test_get_income_not_found(self):
        """Test de récupération d'un revenu inexistant."""
        # Arrange
        mock_repository = Mock()
        use_case = GetIncome(mock_repository)

        mock_repository.get_by_id.return_value = None

        # Act
        response = use_case.execute("income-999", "user-123")

        # Assert
        assert response is None
        mock_repository.get_by_id.assert_called_once_with("income-999", "user-123")

    def test_get_income_with_minimal_data(self):
        """Test de récupération d'un revenu avec des données minimales."""
        # Arrange
        mock_repository = Mock()
        use_case = GetIncome(mock_repository)

        expected_income = Income(
            id="income-456",
            user_id="user-456",
            name="Revenu ponctuel",
            amount=500.0,
            date=datetime(2024, 1, 20),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
            category=IncomeCategory.SALARY,
            description=None,
            is_recurring=False,
            frequency=None,
        )
        mock_repository.get_by_id.return_value = expected_income

        # Act
        response = use_case.execute("income-456", "user-456")

        # Assert
        assert response == expected_income
        assert response.category == IncomeCategory.SALARY
        assert response.description is None
        assert response.is_recurring is False
        assert response.frequency is None
        mock_repository.get_by_id.assert_called_once_with("income-456", "user-456")

    def test_get_income_empty_income_id(self):
        """Test de récupération avec un ID de revenu vide."""
        # Arrange
        mock_repository = Mock()
        use_case = GetIncome(mock_repository)

        # Act
        response = use_case.execute("", "user-123")

        # Assert
        assert response is None
        mock_repository.get_by_id.assert_not_called()

    def test_get_income_empty_user_id(self):
        """Test de récupération avec un ID d'utilisateur vide."""
        # Arrange
        mock_repository = Mock()
        use_case = GetIncome(mock_repository)

        # Act
        response = use_case.execute("income-123", "")

        # Assert
        assert response is None
        mock_repository.get_by_id.assert_not_called()

    def test_get_income_validation_failure(self):
        """Test de récupération avec validation échouée."""
        # Arrange
        mock_repository = Mock()
        use_case = GetIncome(mock_repository)

        # Mock pour simuler que le revenu n'existe pas
        mock_repository.get_by_id.return_value = None

        # Act
        response = use_case.execute("income-123", "user-123")

        # Assert
        assert response is None
        mock_repository.get_by_id.assert_called_once_with("income-123", "user-123")
