"""Tests pour le cas d'utilisation de mise à jour d'un utilisateur."""

import uuid
from datetime import datetime
from app.use_cases.user.update_user import UpdateUser
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

    def get_by_phone_number(self, phone_number: str) -> User:
        for user in self.users.values():
            if user.phone_number == phone_number:
                return user
        return None

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
        """Supprime un utilisateur par son id."""
        if user_id in self.users:
            del self.users[user_id]


def test_update_user_success():
    """Test pour le cas d'utilisation de mise à jour d'un utilisateur avec succès."""

    repo = InMemoryUserRepository()
    user_id = str(uuid.uuid4())

    # Créer un utilisateur initial
    user = User(
        id=user_id,
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password="hashedpassword",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    repo.add(user)

    # Mettre à jour l'utilisateur
    use_case = UpdateUser(repo)
    update_data = {
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com",
    }
    updated_user = use_case.execute(user_id, update_data)

    assert updated_user is not None
    assert updated_user.first_name == "Jane"
    assert updated_user.last_name == "Smith"
    assert updated_user.email == "jane.smith@example.com"
    assert updated_user.password == "hashedpassword"  # Le mot de passe reste inchangé


def test_update_user_partial_update():
    """Test pour la mise à jour partielle d'un utilisateur."""

    repo = InMemoryUserRepository()
    user_id = str(uuid.uuid4())

    # Créer un utilisateur initial
    user = User(
        id=user_id,
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password="hashedpassword",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    repo.add(user)

    # Mettre à jour seulement le prénom
    use_case = UpdateUser(repo)
    update_data = {"first_name": "Jane"}
    updated_user = use_case.execute(user_id, update_data)

    assert updated_user.first_name == "Jane"
    assert updated_user.last_name == "Doe"  # Reste inchangé
    assert updated_user.email == "john.doe@example.com"  # Reste inchangé


def test_update_user_with_invalid_user_id():
    """Test pour la mise à jour d'un utilisateur avec un ID invalide."""

    repo = InMemoryUserRepository()
    use_case = UpdateUser(repo)

    try:
        use_case.execute("invalid_id", {"first_name": "Jane"})
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "L'utilisateur n'existe pas"


def test_update_user_with_empty_user_id():
    """Test pour la mise à jour d'un utilisateur avec un ID vide."""

    repo = InMemoryUserRepository()
    use_case = UpdateUser(repo)

    try:
        use_case.execute("", {"first_name": "Jane"})
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "L'identifiant de l'utilisateur est requis"


def test_update_user_with_empty_first_name():
    """Test pour la mise à jour avec un prénom vide."""

    repo = InMemoryUserRepository()
    user_id = str(uuid.uuid4())

    user = User(
        id=user_id,
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password="hashedpassword",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    repo.add(user)

    use_case = UpdateUser(repo)

    try:
        use_case.execute(user_id, {"first_name": "  "})
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "Le prénom ne peut pas être vide"


def test_update_user_with_empty_last_name():
    """Test pour la mise à jour avec un nom vide."""

    repo = InMemoryUserRepository()
    user_id = str(uuid.uuid4())

    user = User(
        id=user_id,
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password="hashedpassword",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    repo.add(user)

    use_case = UpdateUser(repo)

    try:
        use_case.execute(user_id, {"last_name": ""})
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "Le nom ne peut pas être vide"


def test_update_user_with_invalid_email():
    """Test pour la mise à jour avec un email invalide."""

    repo = InMemoryUserRepository()
    user_id = str(uuid.uuid4())

    user = User(
        id=user_id,
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password="hashedpassword",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    repo.add(user)

    use_case = UpdateUser(repo)

    try:
        use_case.execute(user_id, {"email": "invalid_email"})
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "L'email est invalide"


def test_update_user_with_existing_email():
    """Test pour la mise à jour avec un email déjà utilisé."""

    repo = InMemoryUserRepository()
    user_id1 = str(uuid.uuid4())
    user_id2 = str(uuid.uuid4())

    # Créer deux utilisateurs
    user1 = User(
        id=user_id1,
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password="hashedpassword",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    user2 = User(
        id=user_id2,
        first_name="Jane",
        last_name="Smith",
        email="jane.smith@example.com",
        password="hashedpassword",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    repo.add(user1)
    repo.add(user2)

    # Essayer de mettre à jour user1 avec l'email de user2
    use_case = UpdateUser(repo)

    try:
        use_case.execute(user_id1, {"email": "jane.smith@example.com"})
        assert False, "Should raise ValueError"
    except ValueError as e:
        assert str(e) == "Cet email est déjà utilisé"


def test_update_user_with_same_email():
    """Test pour la mise à jour avec le même email (doit réussir)."""

    repo = InMemoryUserRepository()
    user_id = str(uuid.uuid4())

    user = User(
        id=user_id,
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password="hashedpassword",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    repo.add(user)

    # Mettre à jour avec le même email
    use_case = UpdateUser(repo)
    update_data = {
        "first_name": "Jane",
        "email": "john.doe@example.com",  # Même email
    }
    updated_user = use_case.execute(user_id, update_data)

    assert updated_user.first_name == "Jane"
    assert updated_user.email == "john.doe@example.com"
