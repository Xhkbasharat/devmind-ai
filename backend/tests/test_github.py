
"""Tests for DevMind AI GitHub integration endpoints."""

from fastapi.testclient import TestClient

from app.main import app


def test_github_repository_endpoint_requires_authentication():
    with TestClient(app) as client:
        response = client.get(
            "/github/repositories/octocat/Hello-World"
        )

    assert response.status_code == 401


def test_github_contents_endpoint_requires_authentication():
    with TestClient(app) as client:
        response = client.get(
            "/github/repositories/octocat/Hello-World/contents"
        )

    assert response.status_code == 401


def test_github_endpoints_are_registered():
    with TestClient(app) as client:
        response = client.get("/openapi.json")

    assert response.status_code == 200

    paths = response.json()["paths"]

    assert "/github/repositories/{owner}/{repo}" in paths
    assert (
        "/github/repositories/{owner}/{repo}/contents"
        in paths
    )


def test_github_repository_endpoint_uses_get_method():
    with TestClient(app) as client:
        response = client.get("/openapi.json")

    paths = response.json()["paths"]

    repository_path = paths["/github/repositories/{owner}/{repo}"]

    assert "get" in repository_path


def test_github_contents_endpoint_uses_get_method():
    with TestClient(app) as client:
        response = client.get("/openapi.json")

    paths = response.json()["paths"]

    contents_path = paths[
        "/github/repositories/{owner}/{repo}/contents"
    ]

    assert "get" in contents_path
  
