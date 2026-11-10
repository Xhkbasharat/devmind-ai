
"""Tests for DevMind AI authentication endpoints."""

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


def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "testdeveloper",
            "email": "developer@example.com",
            "password": "StrongPassword123!",
        },
    )

    assert response.status_code in (200, 201)


def test_duplicate_registration_is_rejected(client):
    user_data = {
        "username": "duplicateuser",
        "email": "duplicate@example.com",
        "password": "StrongPassword123!",
    }

    first_response = client.post("/auth/register", json=user_data)
    second_response = client.post("/auth/register", json=user_data)

    assert first_response.status_code in (200, 201)
    assert second_response.status_code == 400


def test_login_user(client):
    client.post(
        "/auth/register",
        json={
            "username": "loginuser",
            "email": "login@example.com",
            "password": "StrongPassword123!",
        },
    )

    response = client.post(
        "/auth/login",
        data={
            "username": "loginuser",
            "password": "StrongPassword123!",
        },
    )

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"].lower() == "bearer"


def test_login_with_wrong_password_is_rejected(client):
    client.post(
        "/auth/register",
        json={
            "username": "wrongpassworduser",
            "email": "wrong@example.com",
            "password": "StrongPassword123!",
        },
    )

    response = client.post(
        "/auth/login",
        data={
            "username": "wrongpassworduser",
            "password": "IncorrectPassword123!",
        },
    )

    assert response.status_code == 401


def test_profile_requires_authentication(client):
    response = client.get("/auth/me")

    assert response.status_code == 401


def test_authenticated_user_can_access_profile(client):
    client.post(
        "/auth/register",
        json={
            "username": "profileuser",
            "email": "profile@example.com",
            "password": "StrongPassword123!",
        },
    )

    login_response = client.post(
        "/auth/login",
        data={
            "username": "profileuser",
            "password": "StrongPassword123!",
        },
    )

    token = login_response.json()["access_token"]

    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json()["username"] == "profileuser"
  
