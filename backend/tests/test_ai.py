
"""Tests for DevMind AI engineering endpoints."""

from fastapi.testclient import TestClient

from app.main import app


def get_api_paths():
    """Return the registered API paths."""
    with TestClient(app) as client:
        response = client.get("/openapi.json")

    assert response.status_code == 200
    return response.json()["paths"]


def test_ai_generate_endpoint_is_registered():
    paths = get_api_paths()

    assert "/ai/generate" in paths
    assert "post" in paths["/ai/generate"]


def test_ai_debug_endpoint_is_registered():
    paths = get_api_paths()

    assert "/ai/debug" in paths
    assert "post" in paths["/ai/debug"]


def test_ai_explain_endpoint_is_registered():
    paths = get_api_paths()

    assert "/ai/explain" in paths
    assert "post" in paths["/ai/explain"]


def test_ai_endpoints_have_request_schemas():
    paths = get_api_paths()

    for endpoint in (
        "/ai/generate",
        "/ai/debug",
        "/ai/explain",
    ):
        operation = paths[endpoint]["post"]

        assert "requestBody" in operation


def test_ai_endpoints_return_documented_responses():
    paths = get_api_paths()

    for endpoint in (
        "/ai/generate",
        "/ai/debug",
        "/ai/explain",
    ):
        operation = paths[endpoint]["post"]

        assert "responses" in operation
        assert "200" in operation["responses"]
      
