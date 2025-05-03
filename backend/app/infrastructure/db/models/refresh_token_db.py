"""Modèle de données pour le token de rafraîchissement."""

from datetime import datetime, UTC
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from app.infrastructure.db.database import Base


class RefreshTokenDB(Base):
    """Modèle de données pour le token de rafraîchissement."""

    __tablename__ = "refresh_tokens"

    token = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    revoked = Column(Boolean, default=False)

    def __repr__(self) -> str:
        """Représentation du token de rafraîchissement."""
        return f"RefreshToken(token={self.token}, user_id={self.user_id})"
