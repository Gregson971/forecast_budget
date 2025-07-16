"""Module contenant le repository des sessions."""

from sqlalchemy.orm import Session as DBSession
from app.domain.entities.session import Session
from app.domain.interfaces.session_repository_interface import SessionRepositoryInterface
from app.infrastructure.db.models.session_db import SessionDB


class SQLSessionRepository(SessionRepositoryInterface):
    """Repository des sessions."""

    def __init__(self, db: DBSession):
        self.db = db

    def add(self, session: Session):
        """Ajoute une session à la base de données."""

        session_db = SessionDB(**session.__dict__)
        self.db.add(session_db)
        self.db.commit()
        self.db.refresh(session_db)

        return session_db

    def get_by_refresh_token(self, token: str) -> Session:
        """Récupère une session par son token de rafraîchissement."""

        session_db = self.db.query(SessionDB).filter_by(refresh_token=token).first()

        if not session_db:
            raise ValueError("Session non trouvée")

        return session_db

    def revoke(self, token: str):
        """Marque une session comme revoquée."""

        session = self.get_by_refresh_token(token)
        if session:
            session.revoked = True
            self.db.commit()

    def get_all_by_user_id(self, user_id: str) -> list[Session]:
        """Récupère toutes les sessions d'un utilisateur."""

        sessions = (
            self.db.query(SessionDB)
            .filter(SessionDB.user_id == user_id)
            .order_by(SessionDB.created_at.desc())
            .all()
        )

        if not sessions:
            raise ValueError("Aucune session trouvée")

        return sessions

    def get_by_id(self, session_id: str) -> Session:
        """Récupère une session par son id."""

        session_db = self.db.query(SessionDB).filter_by(id=session_id).first()

        if not session_db:
            raise ValueError("Session non trouvée")

        return session_db

    def revoke_by_id(self, session_id: str, user_id: str) -> None:
        """Marque une session comme revoquée par son id."""

        session = self.db.query(SessionDB).filter_by(id=session_id, user_id=user_id).first()

        if not session:
            raise ValueError("Session non trouvée")

        session.revoked = True
        self.db.commit()
