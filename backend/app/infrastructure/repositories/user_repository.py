"""Repository pour les opérations liées aux utilisateurs."""

from sqlalchemy.orm import Session
from app.domain.entities.user import User
from app.domain.interfaces.user_repository_interface import UserRepositoryInterface
from app.infrastructure.db.models.user_db import UserDB
from app.infrastructure.db.models.expense_db import ExpenseDB
from app.infrastructure.db.models.income_db import IncomeDB
from app.infrastructure.db.models.session_db import SessionDB
from app.infrastructure.db.models.refresh_token_db import RefreshTokenDB


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
            phone_number=user.phone_number,
        )
        self.db.add(user_db)
        self.db.commit()
        self.db.refresh(user_db)

        return User(
            id=user_db.id,
            first_name=user_db.first_name,
            last_name=user_db.last_name,
            email=user_db.email,
            password=user_db.password,
            created_at=user_db.created_at,
            updated_at=user_db.updated_at,
            phone_number=user_db.phone_number,
        )

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
                phone_number=user_db.phone_number,
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
                phone_number=user_db.phone_number,
            )

        return None

    def get_by_phone_number(self, phone_number: str) -> User:
        """Récupère un utilisateur par son numéro de téléphone."""

        user_db = self.db.query(UserDB).filter(UserDB.phone_number == phone_number).first()

        if user_db:
            return User(
                id=user_db.id,
                first_name=user_db.first_name,
                last_name=user_db.last_name,
                email=user_db.email,
                password=user_db.password,
                created_at=user_db.created_at,
                updated_at=user_db.updated_at,
                phone_number=user_db.phone_number,
            )

        return None

    def update(self, user_id: str, user: User) -> User:
        """Met à jour un utilisateur."""

        user_db = self.db.query(UserDB).filter(UserDB.id == user_id).first()

        if not user_db:
            return None

        # Mettre à jour les champs
        user_db.first_name = user.first_name
        user_db.last_name = user.last_name
        user_db.email = user.email
        user_db.password = user.password
        user_db.phone_number = user.phone_number
        user_db.updated_at = user.updated_at

        self.db.commit()
        self.db.refresh(user_db)

        return User(
            id=user_db.id,
            first_name=user_db.first_name,
            last_name=user_db.last_name,
            email=user_db.email,
            password=user_db.password,
            created_at=user_db.created_at,
            updated_at=user_db.updated_at,
            phone_number=user_db.phone_number,
        )

    def delete(self, user_id: str) -> None:
        """Supprime un utilisateur et toutes ses données associées (cascade)."""

        # Supprimer toutes les dépenses de l'utilisateur
        self.db.query(ExpenseDB).filter(ExpenseDB.user_id == user_id).delete(synchronize_session=False)
        self.db.flush()

        # Supprimer tous les revenus de l'utilisateur
        self.db.query(IncomeDB).filter(IncomeDB.user_id == user_id).delete(synchronize_session=False)
        self.db.flush()

        # Supprimer toutes les sessions de l'utilisateur
        self.db.query(SessionDB).filter(SessionDB.user_id == user_id).delete(synchronize_session=False)
        self.db.flush()

        # Supprimer tous les refresh tokens de l'utilisateur
        self.db.query(RefreshTokenDB).filter(RefreshTokenDB.user_id == user_id).delete(synchronize_session=False)
        self.db.flush()

        # Finalement, supprimer l'utilisateur lui-même
        self.db.query(UserDB).filter(UserDB.id == user_id).delete(synchronize_session=False)
        self.db.flush()

        # Commit toutes les suppressions
        self.db.commit()

        return None
