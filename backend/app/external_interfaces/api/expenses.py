"""Module contenant les routes pour les dépenses."""

import uuid
from datetime import date, datetime, UTC
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.domain.entities.expense import Expense, ExpenseCategory, ExpenseFrequency
from app.domain.entities.user import User
from app.infrastructure.db.database import SessionLocal
from app.infrastructure.repositories.expense_repository import SQLExpenseRepository
from app.infrastructure.security.dependencies import get_current_user
from app.use_cases.expenses.create_expense import CreateExpense
from app.use_cases.expenses.get_expense import GetExpense
from app.use_cases.expenses.list_expenses import ListExpenses
from app.use_cases.expenses.update_expense import UpdateExpense
from app.use_cases.expenses.delete_expense import DeleteExpense


expense_router = APIRouter(prefix="/expenses", tags=["expenses"])


class ExpenseCreateRequest(BaseModel):
    """Modèle de requête pour la création d'une dépense."""

    name: str
    amount: float
    date: date
    category: ExpenseCategory
    description: Optional[str] = None
    is_recurring: Optional[bool] = False
    frequency: Optional[ExpenseFrequency] = None


class ExpenseCategoryResponse(BaseModel):
    """Modèle de réponse pour les catégories de dépenses."""

    value: str
    label: str


class ExpenseFrequencyResponse(BaseModel):
    """Modèle de réponse pour les fréquences de dépenses."""

    value: str
    label: str


# Dépendance d'injection de session DB
def get_db():
    """Dépendance d'injection de session DB."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@expense_router.get("/categories", response_model=list[ExpenseCategoryResponse])
def get_expense_categories():
    """Récupère la liste des catégories de dépenses disponibles."""

    categories = []
    for category in ExpenseCategory:
        # Créer un label plus lisible pour l'affichage
        label = category.value.replace("_", " ").title()
        categories.append(ExpenseCategoryResponse(value=category.value, label=label))

    return categories


@expense_router.get("/frequencies", response_model=list[ExpenseFrequencyResponse])
def get_expense_frequencies():
    """Récupère la liste des fréquences de dépenses disponibles."""

    frequencies = []
    for frequency in ExpenseFrequency:
        # Créer un label plus lisible pour l'affichage
        if frequency.value == "one-time":
            label = "Une fois"
        else:
            label = frequency.value.replace("-", " ").title()
        frequencies.append(ExpenseFrequencyResponse(value=frequency.value, label=label))

    return frequencies


@expense_router.post("", response_model=Expense)
def create_expense(
    expense: ExpenseCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Crée une dépense."""

    use_case = CreateExpense(SQLExpenseRepository(db))

    try:
        expense_data = expense.model_dump()
        expense_data["user_id"] = current_user.id
        expense_data["id"] = str(uuid.uuid4())
        expense_data["created_at"] = datetime.now(UTC)
        expense_data["updated_at"] = datetime.now(UTC)
        expense_obj = Expense(**expense_data)
        new_expense = use_case.execute(expense_obj)
        return new_expense
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@expense_router.get("", response_model=list[Expense])
def list_expenses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Liste toutes les dépenses."""

    try:
        use_case = ListExpenses(SQLExpenseRepository(db))
        return use_case.execute(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@expense_router.get("/{expense_id}", response_model=Expense)
def get_expense(
    expense_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Récupère une dépense."""

    try:
        use_case = GetExpense(SQLExpenseRepository(db))
        return use_case.execute(expense_id, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@expense_router.put("/{expense_id}", response_model=Expense)
def update_expense(
    expense: Expense,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Met à jour une dépense."""

    try:
        use_case = UpdateExpense(SQLExpenseRepository(db))
        return use_case.execute(expense, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@expense_router.delete("/{expense_id}", response_model=Expense)
def delete_expense(
    expense_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Supprime une dépense."""

    try:
        use_case = DeleteExpense(SQLExpenseRepository(db))
        return use_case.execute(expense_id, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
