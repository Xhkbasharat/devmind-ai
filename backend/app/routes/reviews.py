
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.code_review import CodeReview
from app.models.user import User
from app.routes.auth import get_current_user
from app.services.code_analyzer import code_analyzer


router = APIRouter(
    prefix="/reviews",
    tags=["AI Code Reviews"],
)


class ReviewRequest(BaseModel):
    title: str = Field(
        default="Code Review",
        min_length=2,
        max_length=200,
    )

    source_code: str = Field(
        min_length=1,
        max_length=settings.MAX_CODE_LENGTH,
    )

    programming_language: str = Field(
        default="Python",
        min_length=1,
        max_length=80,
    )


class ReviewResponse(BaseModel):
    id: int
    title: str
    programming_language: str
    overall_score: float | None
    severity: str
    issues: list
    recommendations: list
    summary: str | None
    status: str

    model_config = {
        "from_attributes": True,
    }


def determine_severity(analysis: dict) -> str:
    if not analysis.get("valid_syntax", False):
        return "high"

    counts = analysis.get("severity_counts", {})

    if counts.get("critical", 0) > 0:
        return "critical"

    if counts.get("high", 0) > 0:
        return "high"

    if counts.get("medium", 0) > 0:
        return "medium"

    if counts.get("low", 0) > 0:
        return "low"

    return "none"


@router.post(
    "/",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_review(
    request: ReviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if request.programming_language.strip().lower() != "python":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Static analysis currently supports Python only.",
        )

    try:
        analysis = code_analyzer.analyze(
            request.source_code
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    issues = analysis.get("issues", [])

    recommendations = [
        {
            "rule": issue["rule"],
            "recommendation": issue["recommendation"],
        }
        for issue in issues
    ]

    review = CodeReview(
        title=request.title,
        programming_language="Python",
        source_code=request.source_code,
        overall_score=analysis.get("quality_score"),
        severity=determine_severity(analysis),
        issues=issues,
        recommendations=recommendations,
        summary=analysis.get("summary"),
        status=(
            "completed"
            if analysis.get("valid_syntax")
            else "syntax_error"
        ),
        user_id=current_user.id,
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return review


@router.get(
    "/",
    response_model=list[ReviewResponse],
)
def list_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    statement = (
        select(CodeReview)
        .where(CodeReview.user_id == current_user.id)
        .order_by(CodeReview.created_at.desc())
    )

    return list(db.scalars(statement).all())


@router.get(
    "/{review_id}",
    response_model=ReviewResponse,
)
def get_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    statement = select(CodeReview).where(
        CodeReview.id == review_id,
        CodeReview.user_id == current_user.id,
    )

    review = db.scalar(statement)

    if review is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Code review not found.",
        )

    return review


@router.delete(
    "/{review_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    statement = select(CodeReview).where(
        CodeReview.id == review_id,
        CodeReview.user_id == current_user.id,
    )

    review = db.scalar(statement)

    if review is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Code review not found.",
        )

    db.delete(review)
    db.commit()

    return None
  
