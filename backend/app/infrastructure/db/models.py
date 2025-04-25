"""Modèles de données pour la base de données."""

from datetime import datetime, UTC
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
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

    def update_timestamp(self) -> None:
        """Met à jour le timestamp de modification."""
        self.updated_at = datetime.now(UTC)

    def __repr__(self) -> str:
        """Représentation de l'utilisateur."""
        return f"User(id={self.id}, email={self.email})"


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
