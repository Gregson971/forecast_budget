"""Repository pour les opérations liées aux utilisateurs."""

from sqlalchemy.orm import Session
from app.domain.entities.user import User
from app.domain.interfaces.user_repository_interface import UserRepositoryInterface
from app.infrastructure.db.models.user_db import UserDB


class SQLUserRepository(UserRepositoryInterface):
    """Repository pour les opérations liées aux utilisateurs."""

    def __init__(self, db: Session):
        self.db = db

    def add(self, user: User) -> User:
        """Ajoute un utilisateur à la base de données."""

        user_db = UserDB(
            id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password=user.password,
        )
        self.db.add(user_db)
        self.db.commit()

    def get_all(self) -> list[User]:
        """Récupère tous les utilisateurs."""

        users_db = self.db.query(UserDB).all()

        if not users_db:
            return []

        return [User(**user_db.__dict__) for user_db in users_db]

    def get_by_email(self, email: str) -> User:
        """Récupère un utilisateur par son email."""

        user_db = self.db.query(UserDB).filter(UserDB.email == email).first()

        if user_db:
            return User(
                id=user_db.id,
                first_name=user_db.first_name,
                last_name=user_db.last_name,
                email=user_db.email,
                password=user_db.password,
                created_at=user_db.created_at,
                updated_at=user_db.updated_at,
            )

        return None

    def get_by_id(self, user_id: str) -> User:
        """Récupère un utilisateur par son id."""

        user_db = self.db.query(UserDB).filter(UserDB.id == user_id).first()

        if user_db:
            return User(
                id=user_db.id,
                first_name=user_db.first_name,
                last_name=user_db.last_name,
                email=user_db.email,
                password=user_db.password,
                created_at=user_db.created_at,
                updated_at=user_db.updated_at,
            )

        return None
