"""API pour les revenus."""

import uuid
from datetime import date, datetime, UTC
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.domain.entities.income import Income, IncomeCategory, IncomeFrequency
from app.domain.entities.user import User
from app.infrastructure.db.database import SessionLocal
from app.infrastructure.repositories.income_repository import SQLIncomeRepository
from app.infrastructure.security.dependencies import get_current_user
from app.use_cases.income.create_income import CreateIncome
from app.use_cases.income.delete_income import DeleteIncome
from app.use_cases.income.get_income import GetIncome
from app.use_cases.income.list_incomes import ListIncomes
from app.use_cases.income.update_income import UpdateIncome


router = APIRouter(prefix="/incomes", tags=["incomes"])


class IncomeCreateRequest(BaseModel):
    """Requête pour créer un revenu."""

    name: str
    amount: float
    date: date
    category: IncomeCategory
    description: Optional[str] = None
    is_recurring: bool = False
    frequency: Optional[IncomeFrequency] = None


class IncomeUpdateRequest(BaseModel):
    """Requête pour mettre à jour un revenu."""

    name: str
    amount: float
    date: date
    category: IncomeCategory
    description: Optional[str] = None
    is_recurring: bool = False
    frequency: Optional[IncomeFrequency] = None


class IncomeCategoryResponse(BaseModel):
    """Modèle de réponse pour les catégories de revenus."""

    value: str
    label: str


class IncomeFrequencyResponse(BaseModel):
    """Modèle de réponse pour les fréquences de revenus."""

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


@router.get("/categories", response_model=list[IncomeCategoryResponse])
def get_income_categories():
    """Récupère la liste des catégories de revenus disponibles."""

    categories = []
    for category in IncomeCategory:
        # Créer un label plus lisible pour l'affichage
        label = category.value.replace("_", " ").title()
        categories.append(IncomeCategoryResponse(value=category.value, label=label))

    return categories


@router.get("/frequencies", response_model=list[IncomeFrequencyResponse])
def get_income_frequencies():
    """Récupère la liste des fréquences de revenus disponibles."""
    frequencies = []
    for frequency in IncomeFrequency:
        # Créer un label plus lisible pour l'affichage
        label = frequency.value.replace("-", " ").title()
        frequencies.append(IncomeFrequencyResponse(value=frequency.value, label=label))
    return frequencies


@router.post("", response_model=Income)
def create_income(
    request: IncomeCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Crée un nouveau revenu."""
    income_repository = SQLIncomeRepository(db)
    create_income_use_case = CreateIncome(income_repository)

    try:
        income_data = request.model_dump()
        income_data["user_id"] = current_user.id
        income_data["id"] = str(uuid.uuid4())
        income_data["created_at"] = datetime.now(UTC)
        income_data["updated_at"] = datetime.now(UTC)
        income_obj = Income(**income_data)
        new_income = create_income_use_case.execute(income_obj)
        return new_income
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@router.get("", response_model=List[Income])
def list_incomes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Liste tous les revenus de l'utilisateur."""

    try:
        income_repository = SQLIncomeRepository(db)
        use_case = ListIncomes(income_repository)
        return use_case.execute(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@router.get("/{income_id}", response_model=Income)
def get_income(
    income_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Récupère un revenu par son ID."""

    try:
        income_repository = SQLIncomeRepository(db)
        use_case = GetIncome(income_repository)
        return use_case.execute(income_id, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@router.put("/{income_id}", response_model=Income)
def update_income(
    income_id: str,
    request: IncomeUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Met à jour un revenu."""
    income_repository = SQLIncomeRepository(db)
    use_case = UpdateIncome(income_repository)

    try:
        # Récupérer le revenu existant
        get_income_use_case = GetIncome(income_repository)
        existing_income = get_income_use_case.execute(income_id, current_user.id)

        # Mettre à jour les champs
        income_data = request.model_dump()
        income_data["id"] = income_id
        income_data["user_id"] = current_user.id
        income_data["created_at"] = existing_income.created_at
        income_data["updated_at"] = datetime.now(UTC)

        income_obj = Income(**income_data)
        return use_case.execute(income_obj, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@router.delete("/{income_id}")
def delete_income(
    income_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Supprime un revenu."""

    try:
        income_repository = SQLIncomeRepository(db)
        use_case = DeleteIncome(income_repository)
        use_case.execute(income_id, current_user.id)
        return {"message": "Revenu supprimé avec succès"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e
