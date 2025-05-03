"""Modèle de données pour la session."""

from datetime import datetime, UTC
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from app.infrastructure.db.database import Base


class SessionDB(Base):
    """Modèle de données pour la session."""

    __tablename__ = "sessions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    refresh_token = Column(String, unique=True, nullable=False)
    user_agent = Column(String)
    ip_address = Column(String)
    created_at = Column(DateTime, default=datetime.now(UTC))
    revoked = Column(Boolean, default=False)

    def __repr__(self) -> str:
        """Représentation de la session."""
        return f"Session(id={self.id}, user_id={self.user_id})"
