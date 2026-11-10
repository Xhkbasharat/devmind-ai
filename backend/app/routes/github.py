
import re

from fastapi import APIRouter, Depends, HTTPException
from github import Auth, Github, GithubException

from app.config import settings
from app.models.user import User
from app.routes.auth import get_current_user


router = APIRouter(
    prefix="/github",
    tags=["GitHub Integration"],
)


REPOSITORY_NAME_PATTERN = re.compile(
    r"^[A-Za-z0-9_.-]+$"
)


def validate_repository_name(owner: str, repo: str) -> None:
    if (
        not REPOSITORY_NAME_PATTERN.fullmatch(owner)
        or not REPOSITORY_NAME_PATTERN.fullmatch(repo)
        or owner in {".", ".."}
        or repo in {".", ".."}
    ):
        raise HTTPException(
            status_code=422,
            detail="Invalid GitHub repository name.",
        )


def get_github_client():
    token = settings.GITHUB_TOKEN

    if token:
        return Github(auth=Auth.Token(token))

    return Github()


@router.get("/repositories/{owner}/{repo}")
def get_repository(
    owner: str,
    repo: str,
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve metadata for a GitHub repository.

    Private repositories require a configured token
    with permission to read that repository.
    """

    validate_repository_name(owner, repo)

    client = get_github_client()

    try:
        repository = client.get_repo(
            f"{owner}/{repo}"
        )

        return {
            "success": True,
            "repository": {
                "name": repository.name,
                "full_name": repository.full_name,
                "description": repository.description,
                "html_url": repository.html_url,
                "default_branch": repository.default_branch,
                "language": repository.language,
                "stars": repository.stargazers_count,
                "forks": repository.forks_count,
                "open_issues": repository.open_issues_count,
                "private": repository.private,
                "created_at": (
                    repository.created_at.isoformat()
                    if repository.created_at
                    else None
                ),
                "updated_at": (
                    repository.updated_at.isoformat()
                    if repository.updated_at
                    else None
                ),
            },
        }

    except GithubException as exc:
        if exc.status == 404:
            raise HTTPException(
                status_code=404,
                detail="Repository not found or access denied.",
            ) from exc

        if exc.status == 403:
            raise HTTPException(
                status_code=503,
                detail="GitHub API rate limit or access restriction.",
            ) from exc

        raise HTTPException(
            status_code=502,
            detail="GitHub repository request failed.",
        ) from exc

    finally:
        client.close()


@router.get("/repositories/{owner}/{repo}/contents")
def get_repository_contents(
    owner: str,
    repo: str,
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve top-level repository contents.

    Only metadata is returned. File contents are not
    downloaded or executed by this endpoint.
    """

    validate_repository_name(owner, repo)

    client = get_github_client()

    try:
        repository = client.get_repo(
            f"{owner}/{repo}"
        )

        contents = repository.get_contents("")

        items = [
            {
                "name": item.name,
                "path": item.path,
                "type": item.type,
                "size": item.size,
                "html_url": item.html_url,
            }
            for item in contents[:100]
        ]

        return {
            "success": True,
            "repository": repository.full_name,
            "total_returned": len(items),
            "contents": items,
        }

    except GithubException as exc:
        if exc.status == 404:
            raise HTTPException(
                status_code=404,
                detail="Repository or contents not found.",
            ) from exc

        if exc.status == 403:
            raise HTTPException(
                status_code=503,
                detail="GitHub API rate limit or access restriction.",
            ) from exc

        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve repository contents.",
        ) from exc

    finally:
        client.close()
      
