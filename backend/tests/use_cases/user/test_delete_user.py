"""Tests pour le cas d'utilisation de suppression d'un utilisateur."""

import uuid
from uuid import uuid4
from datetime import datetime
from app.use_cases.user.delete_user import DeleteUser
from app.domain.interfaces.user_repository_interface import UserRepositoryInterface
from app.domain.entities.user import User


class InMemoryUserRepository(UserRepositoryInterface):
    """Implémentation en mémoire d'un repository d'utilisateurs."""

    def __init__(self):
        self.users = {}

    def add(self, user: User) -> User:
        self.users[user.id] = user
        return user

    def get_by_id(self, user_id: str) -> User:
        return self.users.get(user_id)

    def get_by_email(self, email: str) -> User:
        """Récupère un utilisateur par son email."""
        for user in self.users.values():
            if user.email == email:
                return user
        return None

    def get_all(self) -> list[User]:
        """Récupère tous les utilisateurs."""
        return list(self.users.values())

    def update(self, user_id: str, user: User) -> User:
        """Met à jour un utilisateur."""
        if user_id in self.users:
            self.users[user_id] = user
            return user
        return None

    def delete(self, user_id: str) -> None:
        if user_id in self.users:
            del self.users[user_id]


def test_delete_user_success():
    """Test pour le cas d'utilisation de suppression d'un utilisateur avec succès."""

    repo = InMemoryUserRepository()
    user_id = str(uuid.uuid4())

    user = User(
        id=user_id,
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password="password",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    repo.add(user)

    use_case = DeleteUser(repo)
    use_case.execute(user_id)

    assert user_id not in repo.users


def test_delete_user_failure_with_invalid_user_id():
    """Test pour le cas d'utilisation de suppression d'un utilisateur avec un id invalide."""

    repo = InMemoryUserRepository()
    use_case = DeleteUser(repo)

    try:
        use_case.execute(str(uuid4()))
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "L'utilisateur n'existe pas"


def test_delete_user_failure_with_empty_user_id():
    """Test pour le cas d'utilisation de suppression d'un utilisateur avec un id vide."""

    repo = InMemoryUserRepository()
    use_case = DeleteUser(repo)

    try:
        use_case.execute("")
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "L'identifiant de l'utilisateur est requis"
