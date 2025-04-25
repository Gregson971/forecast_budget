"""Module contenant le repository des sessions."""

from sqlalchemy.orm import Session as DBSession
from app.domain.session import Session
from app.infrastructure.db.models import SessionDB


class SQLSessionRepository:
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

    def get_by_refresh_token(self, token: str) -> SessionDB | None:
        """Récupère une session par son token de rafraîchissement."""

        return self.db.query(SessionDB).filter_by(refresh_token=token).first()

    def revoke(self, token: str):
        """Marque une session comme revoquée."""

        session = self.get_by_refresh_token(token)
        if session:
            session.revoked = True
            self.db.commit()

    def get_all_by_user_id(self, user_id: str) -> list[SessionDB]:
        """Récupère toutes les sessions d'un utilisateur."""

        return (
            self.db.query(SessionDB)
            .filter(SessionDB.user_id == user_id)
            .order_by(SessionDB.created_at.desc())
            .all()
        )

    def get_by_id(self, session_id: str) -> SessionDB | None:
        """Récupère une session par son id."""

        return self.db.query(SessionDB).filter_by(id=session_id).first()

    def revoke_by_id(self, session_id: str, user_id: str) -> None:
        """Marque une session comme revoquée par son id."""

        session = self.db.query(SessionDB).filter_by(id=session_id, user_id=user_id).first()
        if session:
            session.revoked = True
            self.db.commit()
