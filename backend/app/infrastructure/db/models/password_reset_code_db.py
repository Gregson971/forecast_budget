"""Modèle de données pour les codes de réinitialisation de mot de passe."""

from datetime import datetime, UTC
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from app.infrastructure.db.database import Base


class PasswordResetCodeDB(Base):
    """Modèle de données pour les codes de réinitialisation de mot de passe."""

    __tablename__ = "password_reset_codes"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    code = Column(String, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    used = Column(Boolean, default=False)

    def __repr__(self) -> str:
        """Représentation du code de réinitialisation."""
        return f"PasswordResetCode(code={self.code}, user_id={self.user_id}, used={self.used})"
