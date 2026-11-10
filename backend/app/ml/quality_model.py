
from pathlib import Path

import joblib
import numpy as np

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from app.ml.features import FEATURE_NAMES


class CodeQualityModel:
    """
    Train and use a Random Forest code-quality classifier.

    The model must be trained using a labeled dataset before
    its predictions can be considered meaningful.
    """

    def __init__(self):
        self.model = Pipeline(
            steps=[
                ("scaler", StandardScaler()),
                (
                    "classifier",
                    RandomForestClassifier(
                        n_estimators=200,
                        max_depth=12,
                        min_samples_split=4,
                        class_weight="balanced",
                        random_state=42,
                    ),
                ),
            ]
        )

        self.is_trained = False
        self.training_metrics = {}

    def train(
        self,
        features: list[dict],
        labels: list[str],
    ) -> dict:
        if len(features) != len(labels):
            raise ValueError(
                "Feature and label counts must match."
            )

        if len(features) < 10:
            raise ValueError(
                "At least 10 labeled examples are required."
            )

        allowed_labels = {"good", "average", "poor"}

        if not set(labels).issubset(allowed_labels):
            raise ValueError(
                "Labels must be good, average, or poor."
            )

        if len(set(labels)) < 2:
            raise ValueError(
                "Training requires at least two quality categories."
            )

        X = self._prepare_features(features)
        y = np.array(labels)

        class_counts = {
            label: labels.count(label)
            for label in set(labels)
        }

        if min(class_counts.values()) < 2:
            raise ValueError(
                "Each category needs at least two examples."
            )

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42,
            stratify=y,
        )

        self.model.fit(X_train, y_train)

        predictions = self.model.predict(X_test)

        accuracy = accuracy_score(y_test, predictions)

        report = classification_report(
            y_test,
            predictions,
            output_dict=True,
            zero_division=0,
        )

        self.is_trained = True

        self.training_metrics = {
            "accuracy": round(float(accuracy), 4),
            "training_samples": int(len(X_train)),
            "testing_samples": int(len(X_test)),
            "classification_report": report,
            "classes": sorted(set(labels)),
        }

        return self.training_metrics

    def predict(self, features: dict) -> dict:
        if not self.is_trained:
            raise RuntimeError(
                "Model has not been trained. Train or load it first."
            )

        X = self._prepare_features([features])

        prediction = self.model.predict(X)[0]

        probabilities = self.model.predict_proba(X)[0]

        classifier = self.model.named_steps["classifier"]

        confidence = {
            str(label): round(float(probability), 4)
            for label, probability in zip(
                classifier.classes_,
                probabilities,
            )
        }

        return {
            "quality_category": str(prediction),
            "confidence": confidence,
            "model_type": "RandomForestClassifier",
        }

    def save(self, path: str) -> None:
        if not self.is_trained:
            raise RuntimeError(
                "Cannot save an untrained model."
            )

        model_path = Path(path)
        model_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        joblib.dump(
            {
                "model": self.model,
                "feature_names": FEATURE_NAMES,
                "training_metrics": self.training_metrics,
            },
            model_path,
        )

    def load(self, path: str) -> None:
        model_path = Path(path)

        if not model_path.exists():
            raise FileNotFoundError(
                f"Model file not found: {model_path}"
            )

        saved_data = joblib.load(model_path)

        if saved_data["feature_names"] != FEATURE_NAMES:
            raise ValueError(
                "Saved model feature schema does not match."
            )

        self.model = saved_data["model"]
        self.training_metrics = saved_data["training_metrics"]
        self.is_trained = True

    @staticmethod
    def _prepare_features(
        features: list[dict],
    ) -> np.ndarray:
        rows = []

        for item in features:
            missing = [
                name
                for name in FEATURE_NAMES
                if name not in item
            ]

            if missing:
                raise ValueError(
                    f"Missing required features: {missing}"
                )

            row = [
                float(item[name])
                for name in FEATURE_NAMES
            ]

            if not np.isfinite(row).all():
                raise ValueError(
                    "Features must contain finite numeric values."
                )

            rows.append(row)

        return np.asarray(rows, dtype=float)


quality_model = CodeQualityModel()
      
