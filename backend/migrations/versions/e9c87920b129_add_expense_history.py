"""add expense history

Revision ID: e9c87920b129
Revises: 35655bc0bfb1
Create Date: 2026-03-08 01:51:29.465363
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e9c87920b129'
down_revision = '35655bc0bfb1'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'expense_history',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('group_id', sa.Integer(), nullable=False),
        sa.Column('paid_by', sa.Integer(), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('expense_history')