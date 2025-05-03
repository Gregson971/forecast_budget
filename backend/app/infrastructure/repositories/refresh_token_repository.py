"""Repository pour les opérations liées aux tokens de rafraîchissement."""

from sqlalchemy.orm import Session
from app.domain.entities.token import RefreshToken
from app.domain.interfaces.token_repository_interface import RefreshTokenRepository
from app.infrastructure.db.models.refresh_token_db import RefreshTokenDB


class SQLRefreshTokenRepository(RefreshTokenRepository):
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

    def get_by_token(self, token: str) -> RefreshToken:
        """Récupère un token de rafraîchissement par son token."""

        token_db = self.db.query(RefreshTokenDB).filter_by(token=token).first()
        return RefreshToken(
            token=token_db.token,
            user_id=token_db.user_id,
            created_at=token_db.created_at,
            revoked=token_db.revoked,
        )

    def get_by_user_id(self, user_id: str) -> list[RefreshToken]:
        """Récupère tous les tokens de rafraîchissement d'un utilisateur."""

        token_db = self.db.query(RefreshTokenDB).filter_by(user_id=user_id).all()
        return [
            RefreshToken(
                token=token_db.token,
                user_id=token_db.user_id,
                created_at=token_db.created_at,
                revoked=token_db.revoked,
            )
            for token_db in token_db
        ]
