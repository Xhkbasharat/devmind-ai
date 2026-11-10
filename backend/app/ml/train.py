
import argparse
import csv
import json
from pathlib import Path

from app.ml.features import feature_extractor
from app.ml.quality_model import quality_model


ALLOWED_LABELS = {"good", "average", "poor"}


def load_dataset(csv_path: str) -> tuple[list[dict], list[str]]:
    """
    Load labeled Python examples from a CSV file.

    Required CSV columns:
    source_code,quality_label
    """

    path = Path(csv_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Training dataset not found: {path}"
        )

    features = []
    labels = []

    with path.open(
        "r",
        encoding="utf-8",
        newline="",
    ) as file:
        reader = csv.DictReader(file)

        required_columns = {
            "source_code",
            "quality_label",
        }

        if not required_columns.issubset(
            set(reader.fieldnames or [])
        ):
            raise ValueError(
                "CSV must contain source_code and quality_label columns."
            )

        for row_number, row in enumerate(reader, start=2):
            source_code = row["source_code"]
            label = row["quality_label"].strip().lower()

            if not source_code or not source_code.strip():
                raise ValueError(
                    f"Empty source code at CSV row {row_number}."
                )

            if label not in ALLOWED_LABELS:
                raise ValueError(
                    f"Invalid label '{label}' at CSV row {row_number}."
                )

            extracted = feature_extractor.extract(source_code)

            features.append(extracted)
            labels.append(label)

    if not features:
        raise ValueError("The dataset contains no training examples.")

    return features, labels


def train_pipeline(
    dataset_path: str,
    output_path: str,
) -> dict:
    features, labels = load_dataset(dataset_path)

    metrics = quality_model.train(
        features=features,
        labels=labels,
    )

    quality_model.save(output_path)

    report = {
        "model": "RandomForestClassifier",
        "dataset": dataset_path,
        "artifact": output_path,
        "metrics": metrics,
    }

    report_path = Path(output_path).with_suffix(".metrics.json")
    report_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    report_path.write_text(
        json.dumps(report, indent=2),
        encoding="utf-8",
    )

    return report


def main():
    parser = argparse.ArgumentParser(
        description="Train the DevMind AI code-quality model."
    )

    parser.add_argument(
        "--dataset",
        default="data/code_quality.csv",
        help="Path to labeled CSV training dataset.",
    )

    parser.add_argument(
        "--output",
        default="models/code_quality.joblib",
        help="Path for the trained model artifact.",
    )

    args = parser.parse_args()

    report = train_pipeline(
        dataset_path=args.dataset,
        output_path=args.output,
    )

    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
  
