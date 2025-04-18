"""Tests pour le cas d'utilisation de login d'un utilisateur."""

import uuid
from datetime import datetime
from passlib.hash import bcrypt
from app.use_cases.auth.login_user import LoginUser
from app.domain.user import UserRepository, User


class InMemoryUserRepository(UserRepository):
    """Implémentation en mémoire d'un repository d'utilisateurs."""

    def __init__(self):
        self.users = {}

    def add(self, user: User) -> User:
        self.users[user.email] = user
        return user

    def get_by_email(self, email: str) -> User:
        return self.users.get(email)


def test_login_user_with_valid_credentials():
    """Test pour le cas d'utilisation de login d'un utilisateur avec des identifiants valides."""

    repo = InMemoryUserRepository()

    user = User(
        id=str(uuid.uuid4()),
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password=bcrypt.hash("password"),
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    repo.add(user)

    use_case = LoginUser(repo)
    token = use_case.execute(email="john.doe@example.com", password="password")

    assert token is not None
    assert isinstance(token, str)


def test_login_user_with_invalid_credentials():
    """Test pour le cas d'utilisation de login d'un utilisateur avec des identifiants invalides."""

    repo = InMemoryUserRepository()
    use_case = LoginUser(repo)

    user_data = {
        "email": "john.doe@example.com",
        "password": "wrong_password",
    }

    try:
        use_case.execute(user_data["email"], user_data["password"])
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "Vos identifiants sont invalides"


def test_login_user_with_non_existent_email():
    """Test pour le cas d'utilisation de login d'un utilisateur avec un email non existant."""

    repo = InMemoryUserRepository()
    use_case = LoginUser(repo)

    try:
        use_case.execute(email="non_existent_email@example.com", password="password")
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "Vos identifiants sont invalides"
