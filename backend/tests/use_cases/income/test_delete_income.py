"""Tests pour le cas d'usage de suppression de revenu."""

from unittest.mock import Mock

from app.use_cases.income.delete_income import DeleteIncome


class TestDeleteIncome:
    """Tests pour le cas d'usage DeleteIncome."""

    def test_delete_income_success(self):
        """Test de suppression réussie d'un revenu."""
        # Arrange
        mock_repository = Mock()
        use_case = DeleteIncome(mock_repository)

        # Mock pour simuler que le revenu existe
        mock_repository.get_by_id.return_value = Mock()
        mock_repository.delete.return_value = True

        # Act
        use_case.execute("income-123", "user-123")

        # Assert
        mock_repository.get_by_id.assert_called_once_with("income-123", "user-123")
        mock_repository.delete.assert_called_once_with("income-123", "user-123")

    def test_delete_income_not_found(self):
        """Test de suppression d'un revenu inexistant."""
        # Arrange
        mock_repository = Mock()
        use_case = DeleteIncome(mock_repository)

        # Mock pour simuler que le revenu n'existe pas
        mock_repository.get_by_id.return_value = None

        # Act
        use_case.execute("income-999", "user-123")

        # Assert
        mock_repository.get_by_id.assert_called_once_with("income-999", "user-123")
        mock_repository.delete.assert_not_called()

    def test_delete_income_empty_income_id(self):
        """Test de suppression avec un ID de revenu vide."""
        # Arrange
        mock_repository = Mock()
        use_case = DeleteIncome(mock_repository)

        # Act
        use_case.execute("", "user-123")

        # Assert
        mock_repository.get_by_id.assert_not_called()
        mock_repository.delete.assert_not_called()

    def test_delete_income_empty_user_id(self):
        """Test de suppression avec un ID d'utilisateur vide."""
        # Arrange
        mock_repository = Mock()
        use_case = DeleteIncome(mock_repository)

        # Act
        use_case.execute("income-123", "")

        # Assert
        mock_repository.get_by_id.assert_not_called()
        mock_repository.delete.assert_not_called()
