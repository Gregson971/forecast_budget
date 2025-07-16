"""Tests pour le cas d'usage de récupération des prévisions."""

from datetime import datetime, UTC, timedelta
from unittest.mock import Mock
import pytest

from app.domain.entities.forecast import ForecastData, ForecastPeriod
from app.domain.entities.expense import Expense, ExpenseCategory, ExpenseFrequency
from app.domain.entities.income import Income, IncomeCategory, IncomeFrequency
from app.use_cases.forecast.get_forecast import GetForecast


class TestGetForecast:
    """Tests pour le cas d'usage GetForecast."""

    def setup_method(self):
        """Configuration initiale pour chaque test."""
        self.mock_expense_repo = Mock()
        self.mock_income_repo = Mock()
        self.use_case = GetForecast(self.mock_expense_repo, self.mock_income_repo)

    def test_get_forecast_success_one_month(self):
        """Test de récupération réussie des prévisions pour 1 mois."""
        # Arrange
        user_id = "user-123"
        period = ForecastPeriod.ONE_MONTH

        # Mock des données historiques
        mock_expenses = [
            Expense(
                id="expense-1",
                user_id=user_id,
                name="Loyer",
                amount=800.0,
                date=datetime.now(UTC) - timedelta(days=15),
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=ExpenseCategory.HOUSING,
                is_recurring=True,
                frequency=ExpenseFrequency.MONTHLY,
            ),
            Expense(
                id="expense-2",
                user_id=user_id,
                name="Courses",
                amount=200.0,
                date=datetime.now(UTC) - timedelta(days=5),
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=ExpenseCategory.FOOD,
                is_recurring=False,
            ),
        ]

        mock_incomes = [
            Income(
                id="income-1",
                user_id=user_id,
                name="Salaire",
                amount=3000.0,
                date=datetime.now(UTC) - timedelta(days=10),
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=IncomeCategory.SALARY,
                is_recurring=True,
                frequency=IncomeFrequency.MONTHLY,
            )
        ]

        self.mock_expense_repo.get_by_user_id.return_value = mock_expenses
        self.mock_income_repo.get_all_by_user_id.return_value = mock_incomes

        # Act
        result = self.use_case.execute(user_id, period)

        # Assert
        assert isinstance(result, ForecastData)
        assert result.user_id == user_id
        assert result.period == period
        assert result.total_expenses == 1000.0  # 800 + 200
        assert result.total_income == 3000.0
        assert result.net_balance == 2000.0  # 3000 - 1000
        assert len(result.expenses_data) > 0
        assert len(result.income_data) > 0
        assert len(result.forecast_expenses) == 1  # 1 mois
        assert len(result.forecast_income) == 1  # 1 mois

    def test_get_forecast_success_three_months(self):
        """Test de récupération réussie des prévisions pour 3 mois."""
        # Arrange
        user_id = "user-123"
        period = ForecastPeriod.THREE_MONTHS

        # Mock des données historiques
        mock_expenses = [
            Expense(
                id="expense-1",
                user_id=user_id,
                name="Loyer",
                amount=800.0,
                date=datetime.now(UTC) - timedelta(days=30),
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=ExpenseCategory.HOUSING,
                is_recurring=True,
                frequency=ExpenseFrequency.MONTHLY,
            )
        ]

        mock_incomes = [
            Income(
                id="income-1",
                user_id=user_id,
                name="Salaire",
                amount=3000.0,
                date=datetime.now(UTC) - timedelta(days=30),
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=IncomeCategory.SALARY,
                is_recurring=True,
                frequency=IncomeFrequency.MONTHLY,
            )
        ]

        self.mock_expense_repo.get_by_user_id.return_value = mock_expenses
        self.mock_income_repo.get_all_by_user_id.return_value = mock_incomes

        # Act
        result = self.use_case.execute(user_id, period)

        # Assert
        assert isinstance(result, ForecastData)
        assert result.user_id == user_id
        assert result.period == period
        assert len(result.forecast_expenses) == 3  # 3 mois
        assert len(result.forecast_income) == 3  # 3 mois

    def test_get_forecast_empty_data(self):
        """Test de récupération des prévisions avec des données vides."""
        # Arrange
        user_id = "user-123"
        period = ForecastPeriod.ONE_MONTH

        self.mock_expense_repo.get_by_user_id.return_value = []
        self.mock_income_repo.get_all_by_user_id.return_value = []

        # Act
        result = self.use_case.execute(user_id, period)

        # Assert
        assert isinstance(result, ForecastData)
        assert result.user_id == user_id
        assert result.period == period
        assert result.total_expenses == 0.0
        assert result.total_income == 0.0
        assert result.net_balance == 0.0
        assert len(result.expenses_data) == 0
        assert len(result.income_data) == 0
        assert len(result.forecast_expenses) == 1
        assert len(result.forecast_income) == 1

    def test_get_forecast_invalid_user_id(self):
        """Test avec un ID d'utilisateur invalide."""
        # Arrange
        user_id = ""
        period = ForecastPeriod.ONE_MONTH

        # Act & Assert
        with pytest.raises(ValueError, match="L'utilisateur est requis"):
            self.use_case.execute(user_id, period)

    def test_get_forecast_invalid_period(self):
        """Test avec une période invalide."""
        # Arrange
        user_id = "user-123"
        period = None

        # Act & Assert
        with pytest.raises(ValueError, match="La période est requise"):
            self.use_case.execute(user_id, period)

    def test_get_forecast_data_aggregation(self):
        """Test de l'agrégation correcte des données."""
        # Arrange
        user_id = "user-123"
        period = ForecastPeriod.ONE_MONTH

        # Créer des dépenses pour la même date
        same_date = datetime.now(UTC) - timedelta(days=10)
        mock_expenses = [
            Expense(
                id="expense-1",
                user_id=user_id,
                name="Courses",
                amount=100.0,
                date=same_date,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=ExpenseCategory.FOOD,
            ),
            Expense(
                id="expense-2",
                user_id=user_id,
                name="Transport",
                amount=50.0,
                date=same_date,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=ExpenseCategory.TRANSPORT,
            ),
        ]

        self.mock_expense_repo.get_by_user_id.return_value = mock_expenses
        self.mock_income_repo.get_all_by_user_id.return_value = []

        # Act
        result = self.use_case.execute(user_id, period)

        # Assert
        assert result.total_expenses == 150.0  # 100 + 50 agrégés
        assert len(result.expenses_data) == 1  # Une seule entrée pour la même date

    def test_get_forecast_recurring_items_only(self):
        """Test avec seulement des éléments récurrents."""
        # Arrange
        user_id = "user-123"
        period = ForecastPeriod.SIX_MONTHS

        mock_expenses = [
            Expense(
                id="expense-1",
                user_id=user_id,
                name="Loyer",
                amount=800.0,
                date=datetime.now(UTC) - timedelta(days=30),
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=ExpenseCategory.HOUSING,
                is_recurring=True,
                frequency=ExpenseFrequency.MONTHLY,
            )
        ]

        mock_incomes = [
            Income(
                id="income-1",
                user_id=user_id,
                name="Salaire",
                amount=3000.0,
                date=datetime.now(UTC) - timedelta(days=30),
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=IncomeCategory.SALARY,
                is_recurring=True,
                frequency=IncomeFrequency.MONTHLY,
            )
        ]

        self.mock_expense_repo.get_by_user_id.return_value = mock_expenses
        self.mock_income_repo.get_all_by_user_id.return_value = mock_incomes

        # Act
        result = self.use_case.execute(user_id, period)

        # Assert
        assert len(result.forecast_expenses) == 6  # 6 mois
        assert len(result.forecast_income) == 6  # 6 mois
        # Les prévisions devraient être basées sur les moyennes des éléments récurrents
        assert result.forecast_total_expenses > 0
        assert result.forecast_total_income > 0

    def test_get_forecast_one_year_period(self):
        """Test de récupération des prévisions pour 1 an."""
        # Arrange
        user_id = "user-123"
        period = ForecastPeriod.ONE_YEAR

        self.mock_expense_repo.get_by_user_id.return_value = []
        self.mock_income_repo.get_all_by_user_id.return_value = []

        # Act
        result = self.use_case.execute(user_id, period)

        # Assert
        assert result.period == ForecastPeriod.ONE_YEAR
        assert len(result.forecast_expenses) == 12  # 12 mois
        assert len(result.forecast_income) == 12  # 12 mois
