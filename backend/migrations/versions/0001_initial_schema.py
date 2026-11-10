
"""Initial database schema for DevMind AI.

Revision ID: 0001_initial_schema
Revises:
"""

from alembic import op

from app.database import Base

# Import all models to register their tables in Base.metadata.
from app.models import (
    User,
    Project,
    CodeReview,
    AIAnalysis,
)


revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create all initial application tables."""
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    """Drop the initial application tables."""
    bind = op.get_bind()
    Base.metadata.drop_all(bind=bind)
  
