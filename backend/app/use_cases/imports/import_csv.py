"""Cas d'usage pour importer des transactions depuis un fichier CSV."""

import uuid
from datetime import datetime, UTC
from typing import List

from app.domain.entities.expense import Expense, ExpenseCategory, ExpenseFrequency
from app.domain.entities.income import Income, IncomeCategory, IncomeFrequency
from app.domain.entities.import_result import ImportedTransaction, ImportResult
from app.domain.interfaces.expense_repository_interface import ExpenseRepositoryInterface
from app.domain.interfaces.income_repository_interface import IncomeRepositoryInterface
from app.infrastructure.parsers.csv_parser import BankCSVParser
from app.use_cases.expenses.create_expense import CreateExpense
from app.use_cases.income.create_income import CreateIncome


class ImportCSV:
    """Cas d'usage pour importer des transactions depuis un fichier CSV."""

    # Mapping des catégories vers les enums
    EXPENSE_CATEGORY_MAPPING = {
        "Alimentation": ExpenseCategory.FOOD,
        "Restaurants": ExpenseCategory.FOOD,
        "Transport": ExpenseCategory.TRANSPORT,
        "Carburant": ExpenseCategory.TRANSPORT,
        "Téléphonie": ExpenseCategory.SUBSCRIPTIONS,
        "Abonnements": ExpenseCategory.SUBSCRIPTIONS,
        "Crédit": ExpenseCategory.OTHER,
        "Santé": ExpenseCategory.HEALTH,
        "Assurance": ExpenseCategory.INSURANCE,
        "Loisirs": ExpenseCategory.ENTERTAINMENT,
        "Electronique": ExpenseCategory.SHOPPING,
        "Bricolage": ExpenseCategory.HOUSING,
        "Sport": ExpenseCategory.ENTERTAINMENT,
        "Education": ExpenseCategory.OTHER,
        "Frais bancaires": ExpenseCategory.OTHER,
        "Shopping": ExpenseCategory.SHOPPING,
        "Equipement maison": ExpenseCategory.HOUSING,
        "Jeux": ExpenseCategory.ENTERTAINMENT,
        "Epargne": ExpenseCategory.OTHER,
        "Autres": ExpenseCategory.OTHER,
    }

    INCOME_CATEGORY_MAPPING = {
        "Salaire": IncomeCategory.SALARY,
        "Freelance": IncomeCategory.FREELANCE,
        "Virement": IncomeCategory.OTHER,
        "Remboursement": IncomeCategory.OTHER,
        "Allocation": IncomeCategory.OTHER,
        "Autres": IncomeCategory.OTHER,
    }

    def __init__(
        self,
        expense_repo: ExpenseRepositoryInterface,
        income_repo: IncomeRepositoryInterface,
    ):
        self.expense_repo = expense_repo
        self.income_repo = income_repo
        self.csv_parser = BankCSVParser()
        self.create_expense_use_case = CreateExpense(expense_repo)
        self.create_income_use_case = CreateIncome(income_repo)

    def execute(self, user_id: str, file_content: str) -> ImportResult:
        """
        Importe des transactions depuis un fichier CSV.

        Args:
            user_id: ID de l'utilisateur
            file_content: Contenu du fichier CSV

        Returns:
            ImportResult avec les statistiques de l'import
        """
        result = ImportResult(
            total_transactions=0,
            expenses_created=0,
            incomes_created=0,
            errors=[],
            skipped=0,
            success=True,
        )

        try:
            # Parser le fichier CSV
            transactions = self.csv_parser.parse(file_content)
            result.total_transactions = len(transactions)

            # Récupérer les transactions existantes pour détecter les doublons
            existing_expenses = self.expense_repo.get_by_user_id(user_id)
            existing_incomes = self.income_repo.get_all_by_user_id(user_id)

            # Importer chaque transaction
            for transaction in transactions:
                try:
                    # Vérifier les doublons
                    if self._is_duplicate(transaction, existing_expenses, existing_incomes):
                        result.skipped += 1
                        continue

                    if transaction.is_expense:
                        expense = self._create_expense_from_transaction(user_id, transaction)
                        created = self.create_expense_use_case.execute(expense)
                        if created:
                            result.expenses_created += 1
                            existing_expenses.append(created)
                        else:
                            result.add_error(
                                f"Échec de création de la dépense: {transaction.description}"
                            )
                    else:
                        income = self._create_income_from_transaction(user_id, transaction)
                        created = self.create_income_use_case.execute(income)
                        if created:
                            result.incomes_created += 1
                            existing_incomes.append(created)
                        else:
                            result.add_error(
                                f"Échec de création du revenu: {transaction.description}"
                            )

                except Exception as e:
                    result.add_error(
                        f"Erreur lors de l'import de '{transaction.description}': {str(e)}"
                    )

        except Exception as e:
            result.add_error(f"Erreur lors du parsing du CSV: {str(e)}")
            result.success = False

        return result

    def _is_duplicate(
        self,
        transaction: ImportedTransaction,
        existing_expenses: List[Expense],
        existing_incomes: List[Income],
    ) -> bool:
        """Vérifie si une transaction est un doublon."""
        # Comparer par date, montant et description (ou nom)
        if transaction.is_expense:
            return any(
                expense.date.date() == transaction.date.date()
                and abs(expense.amount - transaction.amount) < 0.01
                and expense.name == transaction.description
                for expense in existing_expenses
            )
        else:
            return any(
                income.date.date() == transaction.date.date()
                and abs(income.amount - transaction.amount) < 0.01
                and income.name == transaction.description
                for income in existing_incomes
            )

    def _create_expense_from_transaction(
        self, user_id: str, transaction: ImportedTransaction
    ) -> Expense:
        """Crée une entité Expense depuis une ImportedTransaction."""
        # Mapper la catégorie
        category = self.EXPENSE_CATEGORY_MAPPING.get(
            transaction.category, ExpenseCategory.OTHER
        )

        # Déterminer la fréquence si récurrent
        frequency = None
        if transaction.is_recurring:
            # Par défaut, on considère les transactions récurrentes comme mensuelles
            frequency = ExpenseFrequency.MONTHLY
        else:
            frequency = ExpenseFrequency.ONE_TIME

        return Expense(
            id=str(uuid.uuid4()),
            user_id=user_id,
            name=transaction.description,
            amount=transaction.amount,
            date=transaction.date,
            category=category,
            description=f"Importé depuis CSV - {transaction.supplier or ''}",
            is_recurring=transaction.is_recurring,
            frequency=frequency,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

    def _create_income_from_transaction(
        self, user_id: str, transaction: ImportedTransaction
    ) -> Income:
        """Crée une entité Income depuis une ImportedTransaction."""
        # Déterminer la catégorie basée sur la description
        category = IncomeCategory.OTHER
        description_upper = transaction.description.upper()

        if "SALAIRE" in description_upper or "SALARY" in description_upper:
            category = IncomeCategory.SALARY
        elif "FREELANCE" in description_upper or "TRAVAIL" in description_upper:
            category = IncomeCategory.FREELANCE
        elif "ALLOCATION" in description_upper or "CHOMAGE" in description_upper:
            category = IncomeCategory.OTHER
        elif "REMBOURSEMENT" in description_upper:
            category = IncomeCategory.OTHER

        # Déterminer la fréquence si récurrent
        frequency = None
        if transaction.is_recurring:
            frequency = IncomeFrequency.MONTHLY
        else:
            frequency = IncomeFrequency.ONE_TIME

        return Income(
            id=str(uuid.uuid4()),
            user_id=user_id,
            name=transaction.description,
            amount=transaction.amount,
            date=transaction.date,
            category=category,
            description=f"Importé depuis CSV - {transaction.supplier or ''}",
            is_recurring=transaction.is_recurring,
            frequency=frequency,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )
