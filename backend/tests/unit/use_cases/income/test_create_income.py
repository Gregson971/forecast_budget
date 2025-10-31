"""Tests pour le cas d'usage de création de revenu."""

from datetime import datetime, UTC
from unittest.mock import Mock

from app.domain.entities.income import Income, IncomeCategory, IncomeFrequency
from app.use_cases.income.create_income import CreateIncome


class TestCreateIncome:
    """Tests pour le cas d'usage CreateIncome."""

    def test_create_income_success(self):
        """Test de création réussie d'un revenu."""
        # Arrange
        mock_repository = Mock()
        use_case = CreateIncome(mock_repository)

        income = Income(
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

        # Act
        response = use_case.execute(income)

        # Assert
        assert response is not None
        assert response.user_id == "user-123"
        assert response.name == "Salaire mensuel"
        assert response.amount == 3000.0
        assert response.category == IncomeCategory.SALARY
        assert response.description == "Salaire de base"
        assert response.is_recurring is True
        assert response.frequency == IncomeFrequency.MONTHLY
        assert response.created_at is not None
        assert response.updated_at is not None

        mock_repository.create.assert_called_once()

        # Vérifier que les champs du revenu créé sont corrects
        created_income = mock_repository.create.call_args[0][0]
        assert created_income.user_id == "user-123"
        assert created_income.name == "Salaire mensuel"
        assert created_income.amount == 3000.0
        assert created_income.category == IncomeCategory.SALARY
        assert created_income.description == "Salaire de base"
        assert created_income.is_recurring is True
        assert created_income.frequency == IncomeFrequency.MONTHLY

    def test_create_income_minimal_data(self):
        """Test de création d'un revenu avec des données minimales."""
        # Arrange
        mock_repository = Mock()
        use_case = CreateIncome(mock_repository)

        income = Income(
            id="income-123",
            user_id="user-123",
            name="Revenu ponctuel",
            amount=500.0,
            date=datetime(2024, 1, 15),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
            category=IncomeCategory.SALARY,
            description=None,
            is_recurring=False,
            frequency=None,
        )

        # Act
        response = use_case.execute(income)

        # Assert
        assert response is not None
        assert response.user_id == "user-123"
        assert response.name == "Revenu ponctuel"
        assert response.amount == 500.0
        assert response.category == IncomeCategory.SALARY
        assert response.description is None
        assert response.is_recurring is False
        assert response.frequency is None

        mock_repository.create.assert_called_once()

        created_income = mock_repository.create.call_args[0][0]
        assert created_income.user_id == "user-123"
        assert created_income.name == "Revenu ponctuel"
        assert created_income.amount == 500.0
        assert created_income.category == IncomeCategory.SALARY
        assert created_income.description is None
        assert created_income.is_recurring is False
        assert created_income.frequency is None

    def test_create_income_validation_failure(self):
        """Test de création d'un revenu avec validation échouée."""
        # Arrange
        mock_repository = Mock()
        use_case = CreateIncome(mock_repository)

        # Revenu sans nom (validation échouera)
        income = Income(
            id="income-123",
            user_id="user-123",
            name="",  # Nom vide
            amount=500.0,
            date=datetime(2024, 1, 15),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
            category=IncomeCategory.SALARY,
            description=None,
            is_recurring=False,
            frequency=None,
        )

        # Act
        response = use_case.execute(income)

        # Assert
        assert response is None
        mock_repository.create.assert_not_called()

    def test_create_income_recurring_without_frequency(self):
        """Test de création d'un revenu récurrent sans fréquence."""
        # Arrange
        mock_repository = Mock()
        use_case = CreateIncome(mock_repository)

        # Revenu récurrent sans fréquence (validation échouera)
        income = Income(
            id="income-123",
            user_id="user-123",
            name="Revenu récurrent",
            amount=500.0,
            date=datetime(2024, 1, 15),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
            category=IncomeCategory.SALARY,
            description=None,
            is_recurring=True,  # Récurrent mais pas de fréquence
            frequency=None,
        )

        # Act
        response = use_case.execute(income)

        # Assert
        assert response is None
        mock_repository.create.assert_not_called()
