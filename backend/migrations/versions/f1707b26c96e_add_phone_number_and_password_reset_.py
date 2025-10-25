"""add phone_number and password_reset_codes

Revision ID: f1707b26c96e
Revises: 5cff4fcb6be8
Create Date: 2025-10-25 16:14:06.203730

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f1707b26c96e'
down_revision: Union[str, None] = '5cff4fcb6be8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add phone_number column to users table
    op.add_column('users', sa.Column('phone_number', sa.String(), nullable=True))

    # Create password_reset_codes table
    op.create_table(
        'password_reset_codes',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('code', sa.String(), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('used', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_password_reset_codes_code'), 'password_reset_codes', ['code'], unique=False)
    op.create_index(op.f('ix_password_reset_codes_id'), 'password_reset_codes', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Remove password_reset_codes table
    op.drop_index(op.f('ix_password_reset_codes_id'), table_name='password_reset_codes')
    op.drop_index(op.f('ix_password_reset_codes_code'), table_name='password_reset_codes')
    op.drop_table('password_reset_codes')

    # Remove phone_number column from users table
    op.drop_column('users', 'phone_number')
