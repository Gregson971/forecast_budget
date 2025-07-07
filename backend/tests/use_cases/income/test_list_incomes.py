"""Tests pour le cas d'usage de liste des revenus."""

from datetime import datetime, UTC
from unittest.mock import Mock

from app.domain.entities.income import Income, IncomeCategory
from app.use_cases.income.list_incomes import ListIncomes


class TestListIncomes:
    """Tests pour le cas d'usage ListIncomes."""

    def test_list_incomes_success(self):
        """Test de récupération réussie de la liste des revenus."""
        # Arrange
        mock_repository = Mock()
        use_case = ListIncomes(mock_repository)

        expected_incomes = [
            Income(
                id="income-1",
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
            ),
            Income(
                id="income-2",
                user_id="user-123",
                name="Freelance",
                amount=500.0,
                date=datetime(2024, 1, 20),
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=IncomeCategory.FREELANCE,
                description="Projet freelance",
                is_recurring=False,
                frequency=None,
            ),
        ]
        mock_repository.get_by_user_id.return_value = expected_incomes

        # Act
        response = use_case.execute("user-123")

        # Assert
        assert response == expected_incomes
        mock_repository.get_by_user_id.assert_called_once_with("user-123")

    def test_list_incomes_empty(self):
        """Test de récupération d'une liste vide de revenus."""
        # Arrange
        mock_repository = Mock()
        use_case = ListIncomes(mock_repository)

        mock_repository.get_by_user_id.return_value = []

        # Act
        response = use_case.execute("user-123")

        # Assert
        assert response == []
        mock_repository.get_by_user_id.assert_called_once_with("user-123")

    def test_list_incomes_empty_user_id(self):
        """Test de récupération avec un ID d'utilisateur vide."""
        # Arrange
        mock_repository = Mock()
        use_case = ListIncomes(mock_repository)

        # Act
        response = use_case.execute("")

        # Assert
        assert response == []
        mock_repository.get_by_user_id.assert_not_called()
