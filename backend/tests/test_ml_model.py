
"""Tests for the DevMind AI code-quality machine-learning model."""

import pytest

from app.ml.quality_model import CodeQualityModel


@pytest.fixture
def training_data():
    """Build a small, balanced synthetic training dataset."""
    features = [
        {
            "lines_of_code": 10 + i,
            "function_count": 1 + i % 3,
            "class_count": i % 2,
            "cyclomatic_complexity": 1 + i % 4,
            "max_nesting_depth": 1 + i % 3,
            "import_count": 1 + i % 3,
            "exception_handler_count": i % 2,
            "comment_count": 2 + i % 5,
            "average_function_length": 8 + i,
            "branch_count": 1 + i % 4,
            "long_function_count": i % 2,
            "total_parameters": 1 + i % 4,
        }
        for i in range(30)
    ]

    labels = (
        ["good"] * 10
        + ["average"] * 10
        + ["poor"] * 10
    )

    return features, labels


def test_model_starts_untrained():
    model = CodeQualityModel()

    assert model.is_trained is False


def test_model_can_train(training_data):
    features, labels = training_data
    model = CodeQualityModel()

    metrics = model.train(features, labels)

    assert model.is_trained is True
    assert isinstance(metrics, dict)


def test_model_predicts_quality_category(training_data):
    features, labels = training_data
    model = CodeQualityModel()
    model.train(features, labels)

    prediction = model.predict(features[0])

    assert prediction["category"] in {
        "good",
        "average",
        "poor",
    }


def test_prediction_contains_confidence(training_data):
    features, labels = training_data
    model = CodeQualityModel()
    model.train(features, labels)

    prediction = model.predict(features[0])

    assert "confidence" in prediction
    assert 0 <= prediction["confidence"] <= 1


def test_model_rejects_insufficient_training_data():
    model = CodeQualityModel()

    features = [
        {
            "lines_of_code": 10,
            "function_count": 1,
            "class_count": 0,
            "cyclomatic_complexity": 1,
            "max_nesting_depth": 1,
            "import_count": 1,
            "exception_handler_count": 0,
            "comment_count": 2,
            "average_function_length": 8,
            "branch_count": 1,
            "long_function_count": 0,
            "total_parameters": 1,
        }
    ]

    with pytest.raises(ValueError):
        model.train(features, ["good"])


def test_model_rejects_invalid_quality_label(training_data):
    features, _ = training_data
    model = CodeQualityModel()

    with pytest.raises(ValueError):
        model.train(features, ["invalid"] * len(features))


def test_prediction_requires_trained_model(training_data):
    features, _ = training_data
    model = CodeQualityModel()

    with pytest.raises((RuntimeError, ValueError)):
        model.predict(features[0])
      
