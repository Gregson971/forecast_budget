"""Module principal de l'application."""

import subprocess


def run_migrations():
    """Exécute les migrations."""

    subprocess.run(["alembic", "upgrade", "head"], check=True)


run_migrations()
