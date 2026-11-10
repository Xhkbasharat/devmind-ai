
from pathlib import Path
from typing import Any

from app.config import settings
from app.ml.features import feature_extractor
from app.ml.quality_model import CodeQualityModel


class CodeQualityPredictor:
    """
    Predict Python code quality using a trained ML model.

    Predictions are disabled until a trained model artifact
    is available. Source code is never executed.
    """

    def __init__(self, model_path: str | None = None):
        self.model_path = Path(
            model_path or (
                Path(settings.MODEL_STORAGE_PATH)
                / "code_quality.joblib"
            )
        )

        self.model = CodeQualityModel()
        self.is_loaded = False

    def load_model(self) -> None:
        if not self.model_path.exists():
            raise FileNotFoundError(
                "Trained code-quality model is not available. "
                "Train the model before requesting predictions."
            )

        self.model.load(str(self.model_path))
        self.is_loaded = True

    def predict(self, source_code: str) -> dict[str, Any]:
        if not self.is_loaded:
            self.load_model()

        features = feature_extractor.extract(source_code)

        prediction = self.model.predict(features)

        return {
            "success": True,
            "model": "RandomForestClassifier",
            "prediction": prediction["quality_category"],
            "confidence": prediction["confidence"],
            "features": features,
            "disclaimer": (
                "This is an experimental ML estimate, not a "
                "definitive assessment of software quality."
            ),
        }


quality_predictor = CodeQualityPredictor()
