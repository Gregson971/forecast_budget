"""Module contenant les routes pour l'import de transactions."""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.domain.entities.user import User
from app.infrastructure.db.database import SessionLocal
from app.infrastructure.repositories.expense_repository import SQLExpenseRepository
from app.infrastructure.repositories.income_repository import SQLIncomeRepository
from app.infrastructure.security.dependencies import get_current_user
from app.use_cases.imports.import_csv import ImportCSV


import_router = APIRouter(prefix="/imports", tags=["imports"])


class ImportResultResponse(BaseModel):
    """Modèle de réponse pour le résultat d'un import."""

    total_transactions: int
    expenses_created: int
    incomes_created: int
    errors: list[str]
    skipped: int
    success: bool


# Dépendance d'injection de session DB
def get_db():
    """Dépendance d'injection de session DB."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@import_router.post("/csv", response_model=ImportResultResponse)
async def import_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Importe des transactions depuis un fichier CSV.

    Le fichier CSV doit être au format d'export bancaire avec les colonnes:
    - dateOp: date d'opération
    - dateVal: date de valeur
    - label: description
    - category: catégorie
    - amount: montant (négatif = dépense, positif = revenu)
    """
    # Vérifier le type de fichier
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le fichier doit être au format CSV",
        )

    try:
        # Lire le contenu du fichier
        content = await file.read()
        file_content = content.decode('utf-8')

        # Créer le use case avec les repositories
        use_case = ImportCSV(
            expense_repo=SQLExpenseRepository(db),
            income_repo=SQLIncomeRepository(db),
        )

        # Exécuter l'import
        result = use_case.execute(current_user.id, file_content)

        # Convertir le résultat en réponse
        return ImportResultResponse(
            total_transactions=result.total_transactions,
            expenses_created=result.expenses_created,
            incomes_created=result.incomes_created,
            errors=result.errors,
            skipped=result.skipped,
            success=result.success,
        )

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Erreur de décodage du fichier. Assurez-vous qu'il est en UTF-8.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'import: {str(e)}",
        )
