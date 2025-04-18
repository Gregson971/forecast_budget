"""Repository pour les opérations liées aux utilisateurs."""

from sqlalchemy.orm import Session
from app.domain.user import User, UserRepository
from app.infrastructure.db.models import UserDB


class SQLUserRepository(UserRepository):
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
