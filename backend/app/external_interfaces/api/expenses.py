"""Module contenant les routes pour les dépenses."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.domain.entities.expense import Expense
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


# Dépendance d'injection de session DB
def get_db():
    """Dépendance d'injection de session DB."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@expense_router.post("", response_model=Expense)
def create_expense(
    expense: Expense, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Crée une dépense."""

    try:
        use_case = CreateExpense(SQLExpenseRepository(db))
        expense.user_id = current_user.id

        return use_case.execute(expense)
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
