"""Repository pour les opérations liées aux utilisateurs."""

from sqlalchemy.orm import Session
from app.domain.entities.user import User
from app.domain.interfaces.user_repository_interface import UserRepository
from app.infrastructure.db.models.user_db import UserDB


class SQLUserRepository(UserRepository):
    """Repository pour les opérations liées aux utilisateurs."""

    def __init__(self, db: Session):
        self.db = db

    def add(self, user: User) -> User:
        """Ajoute un utilisateur à la base de données."""

        user_db = UserDB(**user.__dict__)
        self.db.add(user_db)
        self.db.commit()
        self.db.refresh(user_db)

        return User(**user_db.__dict__)

    def get_by_email(self, email: str) -> User:
        """Récupère un utilisateur par son email."""

        user_db = self.db.query(UserDB).filter(UserDB.email == email).first()

        if not user_db:
            raise ValueError("Utilisateur non trouvé")

        return User(**user_db.__dict__)

    def get_by_id(self, user_id: str) -> User:
        """Récupère un utilisateur par son id."""

        user_db = self.db.query(UserDB).filter(UserDB.id == user_id).first()

        if not user_db:
            raise ValueError("Utilisateur non trouvé")

        return User(**user_db.__dict__)
