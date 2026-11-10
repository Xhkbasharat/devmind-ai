
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

from app.routes.auth import router as auth_router
from app.routes.ai import router as ai_router
from app.routes.analysis import router as analysis_router
from app.routes.projects import router as projects_router
from app.routes.reviews import router as reviews_router
from app.routes.github import router as github_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("DevMind AI backend starting...")

    yield

    print("DevMind AI backend shutting down...")


app = FastAPI(
    title="DevMind AI",
    description=(
        "Advanced AI Software Engineer Platform with "
        "Machine Learning, Code Generation, Debugging, "
        "Automated Code Review, and GitHub Integration."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
    ],
    allow_headers=[
        "Authorization",
        "Content-Type",
    ],
)


# Register application API routers
app.include_router(auth_router)
app.include_router(ai_router)
app.include_router(analysis_router)
app.include_router(projects_router)
app.include_router(reviews_router)
app.include_router(github_router)


@app.get("/", tags=["System"])
async def root():
    return {
        "application": "DevMind AI",
        "description": "AI-powered software engineering platform",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/docs",
    }


@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "DevMind AI API",
    }


@app.get("/api/v1/status", tags=["System"])
async def api_status():
    return {
        "success": True,
        "message": "DevMind AI API is operational",
        "version": "1.0.0",
        "modules": {
            "authentication": "registered",
            "ai_engineering": "registered",
            "static_analysis": "registered",
            "machine_learning": "registered",
            "project_management": "registered",
            "code_reviews": "registered",
            "github_integration": "registered",
        },
    }
    
