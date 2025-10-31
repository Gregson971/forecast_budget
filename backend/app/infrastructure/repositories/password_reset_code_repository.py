"""Repository pour les codes de réinitialisation de mot de passe."""

from datetime import datetime, UTC
from typing import Optional
from sqlalchemy.orm import Session
from app.domain.entities.password_reset_code import PasswordResetCode
from app.domain.interfaces.password_reset_code_repository_interface import (
    PasswordResetCodeRepositoryInterface,
)
from app.infrastructure.db.models.password_reset_code_db import PasswordResetCodeDB


class PasswordResetCodeRepository(PasswordResetCodeRepositoryInterface):
    """Implémentation du repository des codes de réinitialisation."""

    def __init__(self, db: Session):
        """
        Initialise le repository.

        Args:
            db: La session SQLAlchemy
        """
        self.db = db

    def add(self, code: PasswordResetCode) -> PasswordResetCode:
        """
        Ajoute un nouveau code de réinitialisation.

        Args:
            code: Le code de réinitialisation à ajouter

        Returns:
            PasswordResetCode: Le code ajouté
        """
        code_db = PasswordResetCodeDB(
            id=code.id,
            user_id=code.user_id,
            code=code.code,
            expires_at=code.expires_at,
            created_at=code.created_at,
            used=code.used,
        )
        self.db.add(code_db)
        self.db.commit()
        self.db.refresh(code_db)
        return self._to_entity(code_db)

    def get_by_code(self, code: str) -> Optional[PasswordResetCode]:
        """
        Récupère un code de réinitialisation par son code.

        Args:
            code: Le code à rechercher

        Returns:
            Optional[PasswordResetCode]: Le code trouvé ou None
        """
        code_db = (
            self.db.query(PasswordResetCodeDB)
            .filter(PasswordResetCodeDB.code == code)
            .filter(PasswordResetCodeDB.used == False)  # noqa: E712
            .first()
        )
        return self._to_entity(code_db) if code_db else None

    def get_by_user_id(self, user_id: str) -> Optional[PasswordResetCode]:
        """
        Récupère le code de réinitialisation le plus récent pour un utilisateur.

        Args:
            user_id: L'ID de l'utilisateur

        Returns:
            Optional[PasswordResetCode]: Le code le plus récent ou None
        """
        code_db = (
            self.db.query(PasswordResetCodeDB)
            .filter(PasswordResetCodeDB.user_id == user_id)
            .filter(PasswordResetCodeDB.used == False)  # noqa: E712
            .order_by(PasswordResetCodeDB.created_at.desc())
            .first()
        )
        return self._to_entity(code_db) if code_db else None

    def mark_as_used(self, code_id: str) -> None:
        """
        Marque un code comme utilisé.

        Args:
            code_id: L'ID du code à marquer comme utilisé
        """
        code_db = (
            self.db.query(PasswordResetCodeDB)
            .filter(PasswordResetCodeDB.id == code_id)
            .first()
        )
        if code_db:
            code_db.used = True
            self.db.commit()

    def delete_expired_codes(self) -> None:
        """Supprime tous les codes expirés."""
        now = datetime.now(UTC)
        self.db.query(PasswordResetCodeDB).filter(
            PasswordResetCodeDB.expires_at < now
        ).delete(synchronize_session=False)
        self.db.commit()

    def _to_entity(self, code_db: PasswordResetCodeDB) -> PasswordResetCode:
        """
        Convertit un modèle DB en entité.

        Args:
            code_db: Le modèle DB

        Returns:
            PasswordResetCode: L'entité
        """
        # S'assurer que les datetimes ont une timezone UTC
        expires_at = code_db.expires_at.replace(tzinfo=UTC) if code_db.expires_at.tzinfo is None else code_db.expires_at
        created_at = code_db.created_at.replace(tzinfo=UTC) if code_db.created_at.tzinfo is None else code_db.created_at

        return PasswordResetCode(
            id=code_db.id,
            user_id=code_db.user_id,
            code=code_db.code,
            expires_at=expires_at,
            created_at=created_at,
            used=code_db.used,
        )
