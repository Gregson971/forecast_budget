"""Tests pour le cas d'utilisation de création d'un utilisateur."""

from app.use_cases.auth.register_user import RegisterUser
from app.domain.entities.user import User
from app.domain.interfaces.user_repository_interface import UserRepositoryInterface


class InMemoryUserRepository(UserRepositoryInterface):
    """Implémentation en mémoire d'un repository d'utilisateurs."""

    def __init__(self):
        self.users = {}

    def add(self, user: User) -> User:
        self.users[user.email] = user
        return user

    def get_by_email(self, email: str) -> User:
        return self.users.get(email)

    def get_by_id(self, user_id: str) -> User:
        for user in self.users.values():
            if user.id == user_id:
                return user
        return None

    def get_all(self) -> list[User]:
        return list(self.users.values())

    def update(self, user_id: str, user: User) -> User:
        """Met à jour un utilisateur."""
        if user_id in self.users:
            self.users[user_id] = user
            return user
        return None

    def delete(self, user_id: str) -> None:
        """Supprime un utilisateur par son id."""
        email_to_delete = None
        for email, user in self.users.items():
            if user.id == user_id:
                email_to_delete = email
                break
        if email_to_delete:
            del self.users[email_to_delete]


def test_register_new_user():
    """Test pour le cas d'utilisation de création d'un utilisateur."""

    repo = InMemoryUserRepository()
    use_case = RegisterUser(repo)

    user_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "password": "password",
    }

    user = use_case.execute(user_data)

    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.email == "john.doe@example.com"
    assert repo.get_by_email("john.doe@example.com") is not None


def test_register_existing_user_raises_exception():
    """Test pour le cas d'utilisation de création d'un utilisateur existant."""

    repo = InMemoryUserRepository()
    use_case = RegisterUser(repo)

    user_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "password": "password",
    }

    use_case.execute(user_data)

    try:
        use_case.execute(user_data)
        assert False, "Should raise ValueError"
    except ValueError as ve:
        assert str(ve) == "L'utilisateur existe déjà"


def test_register_user_with_empty_fields_raises_exception():
    """
    Test pour le cas d'utilisation de création d'un utilisateur avec
    des champs vides.
    """

    repo = InMemoryUserRepository()
    use_case = RegisterUser(repo)

    user_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "",
        "password": "password",
    }

    try:
        use_case.execute(user_data)
        assert False, "Should raise ValueError"
    except ValueError as ve:
        assert str(ve) == "Le champ email est requis"


def test_register_user_with_missing_fields_raises_exception():
    """
    Test pour le cas d'utilisation de création d'un utilisateur avec
    des champs manquants.
    """

    repo = InMemoryUserRepository()
    use_case = RegisterUser(repo)

    user_data = {
        "first_name": "John",
        "last_name": "Doe",
        "password": "password",
    }

    try:
        use_case.execute(user_data)
        assert False, "Should raise ValueError"
    except ValueError as ve:
        assert str(ve) == "Le champ email est requis"


def test_register_user_with_invalid_email_raises_exception():
    """
    Test pour le cas d'utilisation de création d'un utilisateur avec
    un email invalide.
    """

    repo = InMemoryUserRepository()
    use_case = RegisterUser(repo)

    user_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "invalid_email",
        "password": "password",
    }

    try:
        use_case.execute(user_data)
        assert False, "Should raise ValueError"
    except ValueError as ve:
        assert str(ve) == "L'email est invalide"
