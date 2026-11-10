
"""Tests for DevMind AI code-review endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app


@pytest.fixture
def client():
    """Create an isolated in-memory database for each test."""
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
            "username": "reviewdeveloper",
            "email": "review@example.com",
            "password": "StrongPassword123!",
        },
    )

    response = client.post(
        "/auth/login",
        data={
            "username": "reviewdeveloper",
            "password": "StrongPassword123!",
        },
    )

    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def review_payload():
    """Provide source code for a sample review."""
    return {
        "title": "Python Code Quality Review",
        "language": "python",
        "source_code": '''"""Example module."""

def calculate_total(price, quantity):
    """Calculate the total price."""
    return price * quantity
''',
    }


def test_create_code_review(client, auth_headers, review_payload):
    response = client.post(
        "/reviews/",
        headers=auth_headers,
        json=review_payload,
    )

    assert response.status_code in (200, 201)

    data = response.json()
    assert data["title"] == review_payload["title"]
    assert data["language"] == "python"
    assert "id" in data


def test_list_code_reviews(client, auth_headers, review_payload):
    client.post(
        "/reviews/",
        headers=auth_headers,
        json=review_payload,
    )

    response = client.get(
        "/reviews/",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert any(
        review["title"] == review_payload["title"]
        for review in response.json()
    )


def test_reviews_require_authentication(client, review_payload):
    response = client.post(
        "/reviews/",
        json=review_payload,
    )

    assert response.status_code == 401


def test_get_code_review(client, auth_headers, review_payload):
    create_response = client.post(
        "/reviews/",
        headers=auth_headers,
        json=review_payload,
    )

    review_id = create_response.json()["id"]

    response = client.get(
        f"/reviews/{review_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == review_id


def test_delete_code_review(client, auth_headers, review_payload):
    create_response = client.post(
        "/reviews/",
        headers=auth_headers,
        json=review_payload,
    )

    review_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/reviews/{review_id}",
        headers=auth_headers,
    )

    assert delete_response.status_code in (200, 204)

    get_response = client.get(
        f"/reviews/{review_id}",
        headers=auth_headers,
    )

    assert get_response.status_code == 404
  
