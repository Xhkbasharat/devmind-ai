
"""Tests for DevMind AI project-management endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app


@pytest.fixture
def client():
    """Create an isolated database for each test."""
    test_engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=test_engine,
    )

    Base.metadata.create_all(bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)
    test_engine.dispose()


@pytest.fixture
def auth_headers(client):
    """Register and authenticate a test user."""
    client.post(
        "/auth/register",
        json={
            "username": "projectdeveloper",
            "email": "project@example.com",
            "password": "StrongPassword123!",
        },
    )

    response = client.post(
        "/auth/login",
        data={
            "username": "projectdeveloper",
            "password": "StrongPassword123!",
        },
    )

    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}


def test_create_project(client, auth_headers):
    response = client.post(
        "/projects/",
        headers=auth_headers,
        json={
            "name": "AI Code Assistant",
            "description": "An intelligent code assistant.",
            "programming_language": "Python",
            "repository_url": "https://github.com/example/ai-code-assistant",
        },
    )

    assert response.status_code in (200, 201)
    assert response.json()["name"] == "AI Code Assistant"


def test_list_projects(client, auth_headers):
    client.post(
        "/projects/",
        headers=auth_headers,
        json={
            "name": "Project One",
            "description": "First test project",
            "programming_language": "Python",
        },
    )

    response = client.get(
        "/projects/",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert any(
        project["name"] == "Project One"
        for project in response.json()
    )


def test_project_access_requires_authentication(client):
    response = client.get("/projects/")

    assert response.status_code == 401


def test_update_project(client, auth_headers):
    create_response = client.post(
        "/projects/",
        headers=auth_headers,
        json={
            "name": "Original Project",
            "description": "Original description",
            "programming_language": "Python",
        },
    )

    project_id = create_response.json()["id"]

    response = client.patch(
        f"/projects/{project_id}",
        headers=auth_headers,
        json={"name": "Updated Project"},
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Updated Project"


def test_delete_project(client, auth_headers):
    create_response = client.post(
        "/projects/",
        headers=auth_headers,
        json={
            "name": "Project To Delete",
            "description": "Temporary project",
            "programming_language": "Python",
        },
    )

    project_id = create_response.json()["id"]

    response = client.delete(
        f"/projects/{project_id}",
        headers=auth_headers,
    )

    assert response.status_code in (200, 204)

    get_response = client.get(
        f"/projects/{project_id}",
        headers=auth_headers,
    )

    assert get_response.status_code == 404


def test_user_cannot_access_another_users_project(client, auth_headers):
    create_response = client.post(
        "/projects/",
        headers=auth_headers,
        json={
            "name": "Private Project",
            "description": "Owned by first user",
            "programming_language": "Python",
        },
    )

    project_id = create_response.json()["id"]

    client.post(
        "/auth/register",
        json={
            "username": "anotherdeveloper",
            "email": "another@example.com",
            "password": "StrongPassword123!",
        },
    )

    login_response = client.post(
        "/auth/login",
        data={
            "username": "anotherdeveloper",
            "password": "StrongPassword123!",
        },
    )

    another_token = login_response.json()["access_token"]

    response = client.get(
        f"/projects/{project_id}",
        headers={"Authorization": f"Bearer {another_token}"},
    )

    assert response.status_code == 404
          
