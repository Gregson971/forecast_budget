"""Modèle de données pour l'utilisateur."""

from datetime import datetime, UTC
from sqlalchemy import Column, String, DateTime
from app.infrastructure.db.database import Base


class UserDB(Base):
    """Modèle de données pour l'utilisateur."""

    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC))

    def get_full_name(self) -> str:
        """Retourne le nom complet de l'utilisateur."""
        return f"{self.first_name} {self.last_name}"

    def __repr__(self) -> str:
        """Représentation de l'utilisateur."""
        return f"User(id={self.id}, email={self.email})"
