
from datetime import datetime, timezone

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CodeReview(Base):
    __tablename__ = "code_reviews"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    programming_language: Mapped[str] = mapped_column(
        String(80),
        nullable=False,
    )

    source_code: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    overall_score: Mapped[float | None] = mapped_column(
        nullable=True,
    )

    severity: Mapped[str] = mapped_column(
        String(30),
        default="unknown",
        nullable=False,
    )

    issues: Mapped[list] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    recommendations: Mapped[list] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False,
    )

    project_id: Mapped[int | None] = mapped_column(
        ForeignKey("projects.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    project = relationship("Project")
    user = relationship("User")

    def __repr__(self) -> str:
        return (
            f"<CodeReview id={self.id} "
            f"language={self.programming_language!r} "
            f"severity={self.severity!r}>"
        )
      
