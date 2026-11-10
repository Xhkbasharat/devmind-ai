
"""
DevMind AI database models registry.

Centralizes all SQLAlchemy model imports.
"""

from app.database import Base
from app.models.user import User
from app.models.project import Project
from app.models.code_review import CodeReview
from app.models.ai_analysis import AIAnalysis

__all__ = [
    "Base",
    "User",
    "Project",
    "CodeReview",
    "AIAnalysis",
]
