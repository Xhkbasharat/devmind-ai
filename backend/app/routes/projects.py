
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, HttpUrl
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.routes.auth import get_current_user


router = APIRouter(
    prefix="/projects",
    tags=["Developer Projects"],
)


class ProjectCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)

    description: str | None = Field(
        default=None,
        max_length=5000,
    )

    programming_language: str = Field(
        default="Python",
        min_length=1,
        max_length=80,
    )

    repository_url: HttpUrl | None = None


class ProjectUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    description: str | None = Field(
        default=None,
        max_length=5000,
    )

    programming_language: str | None = Field(
        default=None,
        min_length=1,
        max_length=80,
    )

    repository_url: HttpUrl | None = None

    status: str | None = Field(
        default=None,
        pattern="^(active|completed|archived)$",
    )


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str | None
    programming_language: str
    repository_url: str | None
    status: str
    owner_id: int

    model_config = {
        "from_attributes": True,
    }


def get_owned_project(
    project_id: int,
    user_id: int,
    db: Session,
) -> Project:
    statement = select(Project).where(
        Project.id == project_id,
        Project.owner_id == user_id,
    )

    project = db.scalar(statement)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    return project


@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    request: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = Project(
        name=request.name,
        description=request.description,
        programming_language=request.programming_language,
        repository_url=(
            str(request.repository_url)
            if request.repository_url
            else None
        ),
        owner_id=current_user.id,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


@router.get(
    "/",
    response_model=list[ProjectResponse],
)
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    statement = (
        select(Project)
        .where(Project.owner_id == current_user.id)
        .order_by(Project.created_at.desc())
    )

    return list(db.scalars(statement).all())


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_owned_project(
        project_id,
        current_user.id,
        db,
    )


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    project_id: int,
    request: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_owned_project(
        project_id,
        current_user.id,
        db,
    )

    updates = request.model_dump(exclude_unset=True)

    if "repository_url" in updates:
        updates["repository_url"] = (
            str(updates["repository_url"])
            if updates["repository_url"]
            else None
        )

    for field, value in updates.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return project


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_owned_project(
        project_id,
        current_user.id,
        db,
    )

    db.delete(project)
    db.commit()

    return None
    
