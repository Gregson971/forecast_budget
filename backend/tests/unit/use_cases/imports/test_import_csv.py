"""Tests pour le cas d'utilisation d'import CSV."""

import uuid
from datetime import datetime, UTC
from app.use_cases.imports.import_csv import ImportCSV
from app.domain.entities.expense import Expense, ExpenseCategory, ExpenseFrequency
from app.domain.entities.income import Income, IncomeCategory, IncomeFrequency
from app.domain.interfaces.expense_repository_interface import ExpenseRepositoryInterface
from app.domain.interfaces.income_repository_interface import IncomeRepositoryInterface


class InMemoryExpenseRepository(ExpenseRepositoryInterface):
    """Repository en mémoire pour les dépenses."""

    def __init__(self):
        self.expenses = {}

    def create(self, expense: Expense) -> Expense:
        """Crée une dépense."""
        self.expenses[expense.id] = expense
        return expense

    def add(self, expense: Expense) -> Expense:
        self.expenses[expense.id] = expense
        return expense

    def get_by_id(self, expense_id: str, user_id: str = None) -> Expense:
        return self.expenses.get(expense_id)

    def get_by_user_id(self, user_id: str) -> list[Expense]:
        return [e for e in self.expenses.values() if e.user_id == user_id]

    def get_all(self, user_id: str = None) -> list[Expense]:
        if user_id:
            return self.get_by_user_id(user_id)
        return list(self.expenses.values())

    def update(self, expense: Expense, user_id: str = None) -> Expense:
        if expense.id in self.expenses:
            self.expenses[expense.id] = expense
            return expense
        return None

    def delete(self, expense_id: str, user_id: str = None) -> None:
        if expense_id in self.expenses:
            del self.expenses[expense_id]


class InMemoryIncomeRepository(IncomeRepositoryInterface):
    """Repository en mémoire pour les revenus."""

    def __init__(self):
        self.incomes = {}

    def create(self, income: Income) -> Income:
        """Crée un nouveau revenu."""
        self.incomes[income.id] = income
        return income

    def add(self, income: Income) -> Income:
        self.incomes[income.id] = income
        return income

    def get_by_id(self, income_id: str, user_id: str = None) -> Income:
        return self.incomes.get(income_id)

    def get_all_by_user_id(self, user_id: str, skip: int = 0, limit: int = 100) -> list[Income]:
        incomes = [i for i in self.incomes.values() if i.user_id == user_id]
        return incomes[skip:skip + limit]

    def get_all(self) -> list[Income]:
        return list(self.incomes.values())

    def update(self, income: Income) -> Income:
        if income.id in self.incomes:
            self.incomes[income.id] = income
            return income
        return None

    def delete(self, income_id: str, user_id: str = None) -> bool:
        if income_id in self.incomes:
            del self.incomes[income_id]
            return True
        return False


def test_import_csv_success():
    """Test d'import CSV avec succès."""

    expense_repo = InMemoryExpenseRepository()
    income_repo = InMemoryIncomeRepository()
    user_id = str(uuid.uuid4())

    # CSV valide au format Boursorama
    csv_content = """dateOp;dateVal;label;category;categoryParent;montant;
2024-01-15;2024-01-15;CARREFOUR MARKET;Alimentation;Alimentation & Restauration;-45.50;
2024-01-16;2024-01-16;SALAIRE MENSUEL;Salaire;Revenus;2500.00;
2024-01-17;2024-01-17;STATION TOTAL;Transport;Transport;-60.00;
"""

    use_case = ImportCSV(expense_repo, income_repo)
    result = use_case.execute(user_id, csv_content)

    assert result.success is True
    assert result.total_transactions == 3
    assert result.expenses_created == 2
    assert result.incomes_created == 1
    assert result.skipped == 0
    assert len(result.errors) == 0


def test_import_csv_with_duplicates():
    """Test d'import CSV avec des doublons."""

    expense_repo = InMemoryExpenseRepository()
    income_repo = InMemoryIncomeRepository()
    user_id = str(uuid.uuid4())

    # Ajouter une dépense existante
    existing_expense = Expense(
        id=str(uuid.uuid4()),
        user_id=user_id,
        name="CARREFOUR MARKET",
        amount=45.50,
        date=datetime(2024, 1, 15),
        category=ExpenseCategory.FOOD,
        description="",
        is_recurring=False,
        frequency=ExpenseFrequency.ONE_TIME,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    expense_repo.add(existing_expense)

    # CSV avec un doublon
    csv_content = """dateOp;dateVal;label;category;categoryParent;montant;
2024-01-15;2024-01-15;CARREFOUR MARKET;Alimentation;Alimentation & Restauration;-45.50;
2024-01-16;2024-01-16;STATION TOTAL;Transport;Transport;-60.00;
"""

    use_case = ImportCSV(expense_repo, income_repo)
    result = use_case.execute(user_id, csv_content)

    assert result.success is True
    assert result.total_transactions == 2
    assert result.expenses_created == 1
    assert result.skipped == 1  # La première transaction est un doublon


def test_import_csv_with_invalid_csv():
    """Test d'import CSV avec un CSV invalide."""

    expense_repo = InMemoryExpenseRepository()
    income_repo = InMemoryIncomeRepository()
    user_id = str(uuid.uuid4())

    # CSV invalide (malformé)
    csv_content = """invalid csv content without proper structure"""

    use_case = ImportCSV(expense_repo, income_repo)
    result = use_case.execute(user_id, csv_content)

    assert result.success is False
    assert len(result.errors) > 0


def test_import_csv_empty_file():
    """Test d'import CSV avec un fichier vide."""

    expense_repo = InMemoryExpenseRepository()
    income_repo = InMemoryIncomeRepository()
    user_id = str(uuid.uuid4())

    # CSV vide (seulement l'en-tête)
    csv_content = """dateOp;dateVal;label;category;categoryParent;montant;
"""

    use_case = ImportCSV(expense_repo, income_repo)
    result = use_case.execute(user_id, csv_content)

    assert result.success is True
    assert result.total_transactions == 0
    assert result.expenses_created == 0
    assert result.incomes_created == 0


def test_import_csv_expense_category_mapping():
    """Test du mapping des catégories de dépenses."""

    expense_repo = InMemoryExpenseRepository()
    income_repo = InMemoryIncomeRepository()
    user_id = str(uuid.uuid4())

    # CSV avec différentes catégories
    csv_content = """dateOp;dateVal;label;category;categoryParent;montant;
2024-01-15;2024-01-15;CARREFOUR;Alimentation;Alimentation;-45.50;
2024-01-16;2024-01-16;ESSENCE;Transport;Transport;-60.00;
2024-01-17;2024-01-17;CINEMA;Loisirs;Loisirs;-15.00;
"""

    use_case = ImportCSV(expense_repo, income_repo)
    result = use_case.execute(user_id, csv_content)

    assert result.success is True
    assert result.expenses_created == 3

    # Vérifier que les catégories sont correctement mappées
    expenses = expense_repo.get_by_user_id(user_id)
    categories = [e.category for e in expenses]
    assert ExpenseCategory.FOOD in categories
    assert ExpenseCategory.TRANSPORT in categories
    assert ExpenseCategory.ENTERTAINMENT in categories


def test_import_csv_income_detection():
    """Test de la détection automatique des revenus."""

    expense_repo = InMemoryExpenseRepository()
    income_repo = InMemoryIncomeRepository()
    user_id = str(uuid.uuid4())

    # CSV avec des revenus
    csv_content = """dateOp;dateVal;label;category;categoryParent;montant;
2024-01-15;2024-01-15;SALAIRE MENSUEL;Salaire;Revenus;2500.00;
2024-01-16;2024-01-16;FREELANCE PROJET;Freelance;Revenus;500.00;
2024-01-17;2024-01-17;VIREMENT;Virement;Revenus;100.00;
"""

    use_case = ImportCSV(expense_repo, income_repo)
    result = use_case.execute(user_id, csv_content)

    assert result.success is True
    assert result.incomes_created == 3
    assert result.expenses_created == 0

    # Vérifier que les revenus sont créés
    incomes = income_repo.get_all_by_user_id(user_id)
    assert len(incomes) == 3


def test_import_csv_mixed_transactions():
    """Test d'import CSV avec des dépenses et revenus mélangés."""

    expense_repo = InMemoryExpenseRepository()
    income_repo = InMemoryIncomeRepository()
    user_id = str(uuid.uuid4())

    # CSV avec dépenses et revenus mélangés
    csv_content = """dateOp;dateVal;label;category;categoryParent;montant;
2024-01-15;2024-01-15;CARREFOUR;Alimentation;Alimentation;-45.50;
2024-01-16;2024-01-16;SALAIRE;Salaire;Revenus;2500.00;
2024-01-17;2024-01-17;ESSENCE;Transport;Transport;-60.00;
2024-01-18;2024-01-18;FREELANCE;Freelance;Revenus;500.00;
"""

    use_case = ImportCSV(expense_repo, income_repo)
    result = use_case.execute(user_id, csv_content)

    assert result.success is True
    assert result.total_transactions == 4
    assert result.expenses_created == 2
    assert result.incomes_created == 2


def test_import_csv_duplicate_income_detection():
    """Test de détection des doublons pour les revenus."""

    expense_repo = InMemoryExpenseRepository()
    income_repo = InMemoryIncomeRepository()
    user_id = str(uuid.uuid4())

    # Ajouter un revenu existant
    existing_income = Income(
        id=str(uuid.uuid4()),
        user_id=user_id,
        name="SALAIRE MENSUEL",
        amount=2500.00,
        date=datetime(2024, 1, 15),
        category=IncomeCategory.SALARY,
        description="",
        is_recurring=True,
        frequency=IncomeFrequency.MONTHLY,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    income_repo.add(existing_income)

    # CSV avec un doublon de revenu
    csv_content = """dateOp;dateVal;label;category;categoryParent;montant;
2024-01-15;2024-01-15;SALAIRE MENSUEL;Salaire;Revenus;2500.00;
2024-01-16;2024-01-16;FREELANCE;Freelance;Revenus;500.00;
"""

    use_case = ImportCSV(expense_repo, income_repo)
    result = use_case.execute(user_id, csv_content)

    assert result.success is True
    assert result.total_transactions == 2
    assert result.incomes_created == 1  # Seulement le freelance
    assert result.skipped == 1  # Le salaire est un doublon
