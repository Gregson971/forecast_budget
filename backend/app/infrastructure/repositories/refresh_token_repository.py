"""Repository pour les opérations liées aux tokens de rafraîchissement."""

from sqlalchemy.orm import Session
from app.domain.token import RefreshToken
from app.infrastructure.db.models import RefreshTokenDB


class SQLRefreshTokenRepository:
    """Repository pour les opérations liées aux tokens de rafraîchissement."""

    def __init__(self, db: Session):
        self.db = db

    def add(self, token: RefreshToken) -> RefreshToken:
        """Ajoute un token de rafraîchissement à la base de données."""
        token_db = RefreshTokenDB(
            token=token.token,
            user_id=token.user_id,
            created_at=token.created_at,
            revoked=token.revoked,
        )
        self.db.add(token_db)
        self.db.commit()

    def revoke(self, token_str: str) -> None:
        """Marque un token de rafraîchissement comme revoqué."""

        token = self.db.query(RefreshTokenDB).filter(RefreshTokenDB.token == token_str).first()
        if token:
            token.revoked = True
            self.db.commit()

    def is_valid(self, token_str: str) -> bool:
        """Vérifie si un token de rafraîchissement est valide."""

        token = self.db.query(RefreshTokenDB).filter_by(token=token_str, revoked=False).first()
        return token is not None
