
"""Tests for the DevMind AI static code analyzer."""

import pytest

from app.services.code_analyzer import CodeAnalyzer


@pytest.fixture
def analyzer():
    return CodeAnalyzer()


def test_clean_python_code(analyzer):
    code = '''"""Example module."""

def add_numbers(first, second):
    """Add two numbers."""
    return first + second
'''
    result = analyzer.analyze(code)

    assert result["success"] is True
    assert result["score"] >= 0
    assert result["score"] <= 100


def test_syntax_error_detection(analyzer):
    code = "def broken_function(:\n    return 10"

    result = analyzer.analyze(code)

    assert result["success"] is False
    assert "syntax" in result["summary"].lower()


def test_unused_import_detection(analyzer):
    code = '''import os

def calculate():
    """Return a fixed number."""
    return 42
'''
    result = analyzer.analyze(code)

    assert result["success"] is True
    assert any(
        "unused import" in issue["message"].lower()
        for issue in result["issues"]
    )


def test_missing_docstring_detection(analyzer):
    code = '''def calculate_total(first, second):
    return first + second
'''
    result = analyzer.analyze(code)

    assert result["success"] is True
    assert any(
        "docstring" in issue["message"].lower()
        for issue in result["issues"]
    )


def test_broad_exception_detection(analyzer):
    code = '''def process_data():
    """Process data."""
    try:
        value = int("invalid")
    except Exception:
        return None
    return value
'''
    result = analyzer.analyze(code)

    assert result["success"] is True
    assert any(
        "exception" in issue["message"].lower()
        for issue in result["issues"]
    )


def test_score_is_within_valid_range(analyzer):
    code = '''def multiply(first, second):
    """Multiply two numbers."""
    return first * second
'''
    result = analyzer.analyze(code)

    assert 0 <= result["score"] <= 100


def test_empty_source_code(analyzer):
    result = analyzer.analyze("")

    assert result["success"] is True
    assert 0 <= result["score"] <= 100
  
