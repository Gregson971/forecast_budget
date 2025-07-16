"""Tests pour le service de prévisions."""

from datetime import datetime, UTC, timedelta
from unittest.mock import Mock

from app.domain.entities.forecast import ForecastData, ForecastPeriod
from app.domain.entities.expense import Expense, ExpenseCategory, ExpenseFrequency
from app.domain.entities.income import Income, IncomeCategory, IncomeFrequency
from app.domain.services.forecast_service import ForecastService


class TestForecastService:
    """Tests pour le service ForecastService."""

    def setup_method(self):
        """Configuration initiale pour chaque test."""
        self.mock_expense_repo = Mock()
        self.mock_income_repo = Mock()
        self.service = ForecastService(self.mock_expense_repo, self.mock_income_repo)

    def test_calculate_forecast_basic(self):
        """Test de calcul de prévision basique."""
        # Arrange
        user_id = "user-123"
        period = ForecastPeriod.ONE_MONTH

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
            )
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
        result = self.service.calculate_forecast(user_id, period)

        # Assert
        assert isinstance(result, ForecastData)
        assert result.user_id == user_id
        assert result.period == period
        assert result.total_expenses == 800.0
        assert result.total_income == 3000.0
        assert result.net_balance == 2200.0

    def test_calculate_forecast_empty_data(self):
        """Test de calcul avec des données vides."""
        # Arrange
        user_id = "user-123"
        period = ForecastPeriod.ONE_MONTH

        self.mock_expense_repo.get_by_user_id.return_value = []
        self.mock_income_repo.get_all_by_user_id.return_value = []

        # Act
        result = self.service.calculate_forecast(user_id, period)

        # Assert
        assert result.total_expenses == 0.0
        assert result.total_income == 0.0
        assert result.net_balance == 0.0
        assert len(result.expenses_data) == 0
        assert len(result.income_data) == 0

    def test_aggregate_data_same_date(self):
        """Test d'agrégation de données pour la même date."""
        # Arrange
        same_date = datetime.now(UTC) - timedelta(days=10)
        expenses = [
            Expense(
                id="expense-1",
                user_id="user-123",
                name="Courses",
                amount=100.0,
                date=same_date,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=ExpenseCategory.FOOD,
            ),
            Expense(
                id="expense-2",
                user_id="user-123",
                name="Transport",
                amount=50.0,
                date=same_date,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=ExpenseCategory.TRANSPORT,
            ),
        ]

        # Act
        result = self.service._aggregate_data(expenses)

        # Assert
        assert len(result) == 1
        assert result[0].amount == 150.0  # 100 + 50
        assert result[0].date.date() == same_date.date()

    def test_aggregate_data_different_dates(self):
        """Test d'agrégation de données pour des dates différentes."""
        # Arrange
        date1 = datetime.now(UTC) - timedelta(days=10)
        date2 = datetime.now(UTC) - timedelta(days=5)
        expenses = [
            Expense(
                id="expense-1",
                user_id="user-123",
                name="Courses",
                amount=100.0,
                date=date1,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=ExpenseCategory.FOOD,
            ),
            Expense(
                id="expense-2",
                user_id="user-123",
                name="Transport",
                amount=50.0,
                date=date2,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=ExpenseCategory.TRANSPORT,
            ),
        ]

        # Act
        result = self.service._aggregate_data(expenses)

        # Assert
        assert len(result) == 2
        assert result[0].amount == 100.0
        assert result[1].amount == 50.0

    def test_calculate_monthly_average(self):
        """Test de calcul de la moyenne mensuelle."""
        # Arrange
        expenses = [
            Expense(
                id="expense-1",
                user_id="user-123",
                name="Loyer",
                amount=800.0,
                date=datetime.now(UTC),
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=ExpenseCategory.HOUSING,
            ),
            Expense(
                id="expense-2",
                user_id="user-123",
                name="Électricité",
                amount=200.0,
                date=datetime.now(UTC),
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
                category=ExpenseCategory.UTILITIES,
            ),
        ]

        # Act
        result = self.service._calculate_monthly_average(expenses)

        # Assert
        assert result == 500.0  # (800 + 200) / 2

    def test_calculate_monthly_average_empty(self):
        """Test de calcul de la moyenne avec une liste vide."""
        # Act
        result = self.service._calculate_monthly_average([])

        # Assert
        assert result == 0.0

    def test_get_months_ahead(self):
        """Test de calcul du nombre de mois à prévoir."""
        # Test pour chaque période
        assert self.service._get_months_ahead(ForecastPeriod.ONE_MONTH) == 1
        assert self.service._get_months_ahead(ForecastPeriod.THREE_MONTHS) == 3
        assert self.service._get_months_ahead(ForecastPeriod.SIX_MONTHS) == 6
        assert self.service._get_months_ahead(ForecastPeriod.ONE_YEAR) == 12

    def test_get_start_date(self):
        """Test de calcul de la date de début."""
        end_date = datetime.now(UTC)

        # Test pour chaque période
        start_date_1m = self.service._get_start_date(end_date, ForecastPeriod.ONE_MONTH)
        start_date_3m = self.service._get_start_date(end_date, ForecastPeriod.THREE_MONTHS)
        start_date_6m = self.service._get_start_date(end_date, ForecastPeriod.SIX_MONTHS)
        start_date_1y = self.service._get_start_date(end_date, ForecastPeriod.ONE_YEAR)

        assert (end_date - start_date_1m).days == 30
        assert (end_date - start_date_3m).days == 90
        assert (end_date - start_date_6m).days == 180
        assert (end_date - start_date_1y).days == 365

    def test_forecast_calculation_with_recurring_items(self):
        """Test de calcul des prévisions avec des éléments récurrents."""
        # Arrange
        user_id = "user-123"
        period = ForecastPeriod.THREE_MONTHS

        # Dépenses récurrentes
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

        # Revenus récurrents
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
        result = self.service.calculate_forecast(user_id, period)

        # Assert
        assert len(result.forecast_expenses) == 3
        assert len(result.forecast_income) == 3
        # Les prévisions devraient être basées sur les moyennes des éléments récurrents
        assert result.forecast_total_expenses == 800.0 * 3  # 800 par mois * 3 mois
        assert result.forecast_total_income == 3000.0 * 3  # 3000 par mois * 3 mois
