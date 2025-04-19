"""Tests pour le cas d'utilisation de récupération d'un utilisateur."""

import uuid
from datetime import datetime
from app.use_cases.user.get_user import GetUser
from app.domain.user import UserRepository, User


class InMemoryUserRepository(UserRepository):
    """Implémentation en mémoire d'un repository d'utilisateurs."""

    def __init__(self):
        self.users = {}

    def add(self, user: User) -> User:
        self.users[user.id] = user
        return user

    def get_by_email(self, email: str) -> User:
        for user in self.users.values():
            if user.email == email:
                return user
        return None

    def get_by_id(self, user_id: str) -> User:
        return self.users.get(user_id)


def test_get_user_with_valid_id():
    """Test pour le cas d'utilisation de récupération d'un utilisateur avec un id valide."""

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

    use_case = GetUser(repo)
    result = use_case.execute(user_id)

    assert result is not None
    assert result.id == user_id
    assert result.first_name == "John"
    assert result.last_name == "Doe"
    assert result.email == "john.doe@example.com"


def test_get_user_with_invalid_id():
    """Test pour le cas d'utilisation de récupération d'un utilisateur avec un id invalide."""

    repo = InMemoryUserRepository()
    use_case = GetUser(repo)

    try:
        use_case.execute("invalid_id")
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "Utilisateur non trouvé"


def test_get_user_with_empty_id():
    """Test pour le cas d'utilisation de récupération d'un utilisateur avec un id vide."""

    repo = InMemoryUserRepository()
    use_case = GetUser(repo)

    try:
        use_case.execute("")
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "L'identifiant de l'utilisateur est requis"
