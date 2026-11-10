
from typing import Literal

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.config import settings
from app.services.ai_service import AIServiceError, ai_service


router = APIRouter(
    prefix="/ai",
    tags=["AI Engineering"],
)


class CodeGenerationRequest(BaseModel):
    description: str = Field(
        min_length=10,
        max_length=10000,
    )

    programming_language: str = Field(
        default="Python",
        min_length=1,
        max_length=80,
    )


class DebugRequest(BaseModel):
    source_code: str = Field(
        min_length=1,
        max_length=settings.MAX_CODE_LENGTH,
    )

    programming_language: str = Field(
        default="Python",
        min_length=1,
        max_length=80,
    )

    error_message: str | None = Field(
        default=None,
        max_length=5000,
    )


class ExplainRequest(BaseModel):
    source_code: str = Field(
        min_length=1,
        max_length=settings.MAX_CODE_LENGTH,
    )

    programming_language: str = Field(
        default="Python",
        min_length=1,
        max_length=80,
    )


class AIResponse(BaseModel):
    success: bool
    task: Literal["code_generation", "debugging", "explanation"]
    programming_language: str
    result: str


async def execute_ai_task(
    task: str,
    programming_language: str,
    operation,
) -> AIResponse:
    try:
        result = await operation()

        return AIResponse(
            success=True,
            task=task,
            programming_language=programming_language,
            result=result,
        )

    except AIServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        # Do not expose internal exception details to API clients.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected AI processing error occurred.",
        ) from exc


@router.post(
    "/generate",
    response_model=AIResponse,
)
async def generate_code(
    request: CodeGenerationRequest,
):
    """
    Generate source code from a natural-language requirement.
    """

    return await execute_ai_task(
        task="code_generation",
        programming_language=request.programming_language,
        operation=lambda: ai_service.generate_code(
            description=request.description,
            programming_language=request.programming_language,
        ),
    )


@router.post(
    "/debug",
    response_model=AIResponse,
)
async def debug_code(
    request: DebugRequest,
):
    """
    Analyze submitted source code and suggest corrections.
    """

    return await execute_ai_task(
        task="debugging",
        programming_language=request.programming_language,
        operation=lambda: ai_service.debug_code(
            source_code=request.source_code,
            programming_language=request.programming_language,
            error_message=request.error_message,
        ),
    )


@router.post(
    "/explain",
    response_model=AIResponse,
)
async def explain_code(
    request: ExplainRequest,
):
    """
    Explain source code using the configured AI provider.
    """

    return await execute_ai_task(
        task="explanation",
        programming_language=request.programming_language,
        operation=lambda: ai_service.explain_code(
            source_code=request.source_code,
            programming_language=request.programming_language,
        ),
        )
  
