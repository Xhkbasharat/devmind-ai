
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import settings
from app.services.code_analyzer import code_analyzer
from app.ml.predict import quality_predictor


router = APIRouter(
    prefix="/analysis",
    tags=["Code Analysis and Machine Learning"],
)


class CodeAnalysisRequest(BaseModel):
    source_code: str = Field(
        min_length=1,
        max_length=settings.MAX_CODE_LENGTH,
    )


class StaticAnalysisResponse(BaseModel):
    success: bool
    analysis: dict


class QualityPredictionResponse(BaseModel):
    success: bool
    model: str
    prediction: str
    confidence: dict[str, float]
    features: dict
    disclaimer: str


@router.post(
    "/static",
    response_model=StaticAnalysisResponse,
)
async def analyze_code(
    request: CodeAnalysisRequest,
):
    """
    Run static Python code-quality analysis.

    Does not execute submitted source code.
    """

    try:
        result = code_analyzer.analyze(
            request.source_code
        )

        return StaticAnalysisResponse(
            success=True,
            analysis=result,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc


@router.post(
    "/predict",
    response_model=QualityPredictionResponse,
)
async def predict_code_quality(
    request: CodeAnalysisRequest,
):
    """
    Predict code quality using the trained ML model.
    """

    try:
        result = quality_predictor.predict(
            request.source_code
        )

        return QualityPredictionResponse(**result)

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail=(
                "The ML model is not trained or deployed yet."
            ),
        ) from exc

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc
      
