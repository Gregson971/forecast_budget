"""add_expense_category_frequency_enum

Revision ID: 6c4cba7cbda0
Revises: 74e69bc3cbde
Create Date: 2025-06-21 21:47:49.170585

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6c4cba7cbda0'
down_revision: Union[str, None] = '74e69bc3cbde'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        'expenses',
        'category',
        existing_type=sa.VARCHAR(),
        type_=sa.Enum(
            'FOOD',
            'TRANSPORT',
            'ENTERTAINMENT',
            'SHOPPING',
            'HEALTH',
            'HOUSING',
            'UTILITIES',
            'INSURANCE',
            'SUBSCRIPTIONS',
            'OTHER',
            name='expensecategory',
        ),
        nullable=False,
        postgresql_using="category::expensecategory",
    )
    op.alter_column(
        'expenses',
        'frequency',
        existing_type=sa.VARCHAR(),
        type_=sa.Enum('WEEKLY', 'MONTHLY', 'YEARLY', 'ONE_TIME', name='expensefrequency'),
        existing_nullable=True,
        postgresql_using="frequency::expensefrequency",
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        'expenses',
        'frequency',
        existing_type=sa.Enum('WEEKLY', 'MONTHLY', 'YEARLY', 'ONE_TIME', name='expensefrequency'),
        type_=sa.VARCHAR(),
        existing_nullable=True,
    )
    op.alter_column(
        'expenses',
        'category',
        existing_type=sa.Enum(
            'FOOD',
            'TRANSPORT',
            'ENTERTAINMENT',
            'SHOPPING',
            'HEALTH',
            'HOUSING',
            'UTILITIES',
            'INSURANCE',
            'SUBSCRIPTIONS',
            'OTHER',
            name='expensecategory',
        ),
        type_=sa.VARCHAR(),
        nullable=True,
    )
    # ### end Alembic commands ###
