
"""Tests for DevMind AI API health and system endpoints."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="module")
def client():
    """Create a test client for the API."""
    with TestClient(app) as test_client:
        yield test_client


def test_root_endpoint(client):
    response = client.get("/")

    assert response.status_code == 200

    data = response.json()
    assert data["application"] == "DevMind AI"
    assert data["status"] == "online"
    assert data["documentation"] == "/docs"


def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "DevMind AI API"


def test_api_status_endpoint(client):
    response = client.get("/api/v1/status")

    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert data["version"] == "1.0.0"

    expected_modules = [
        "authentication",
        "ai_engineering",
        "static_analysis",
        "machine_learning",
        "project_management",
        "code_reviews",
        "github_integration",
    ]

    for module in expected_modules:
        assert data["modules"][module] == "registered"


def test_openapi_schema_endpoint(client):
    response = client.get("/openapi.json")

    assert response.status_code == 200

    schema = response.json()
    assert schema["info"]["title"] == "DevMind AI"
    assert "/health" in schema["paths"]
    assert "/auth/register" in schema["paths"]


def test_swagger_documentation_endpoint(client):
    response = client.get("/docs")

    assert response.status_code == 200
    assert "swagger-ui" in response.text.lower()
  
