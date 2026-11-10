
"""Tests for DevMind AI machine-learning feature extraction."""

import pytest

from app.ml.features import FEATURE_NAMES, extract_features


@pytest.fixture
def sample_code():
    return '''"""Sample Python module."""

import math


class Calculator:
    """Perform basic calculations."""

    def add(self, first, second):
        """Add two numbers."""
        if first > 0:
            return first + second
        return second
'''


def test_feature_extraction_returns_dictionary(sample_code):
    features = extract_features(sample_code)

    assert isinstance(features, dict)


def test_all_required_features_are_extracted(sample_code):
    features = extract_features(sample_code)

    for feature_name in FEATURE_NAMES:
        assert feature_name in features


def test_feature_values_are_numeric(sample_code):
    features = extract_features(sample_code)

    for feature_name in FEATURE_NAMES:
        assert isinstance(features[feature_name], (int, float))


def test_lines_of_code_is_positive(sample_code):
    features = extract_features(sample_code)

    assert features["lines_of_code"] > 0


def test_function_count(sample_code):
    features = extract_features(sample_code)

    assert features["function_count"] == 1


def test_class_count(sample_code):
    features = extract_features(sample_code)

    assert features["class_count"] == 1


def test_import_count(sample_code):
    features = extract_features(sample_code)

    assert features["import_count"] == 1


def test_branch_count(sample_code):
    features = extract_features(sample_code)

    assert features["branch_count"] >= 1


def test_empty_source_code():
    features = extract_features("")

    assert isinstance(features, dict)

    for feature_name in FEATURE_NAMES:
        assert feature_name in features
        assert features[feature_name] >= 0
      
