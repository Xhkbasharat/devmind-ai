
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Application startup
    print("DevMind AI backend starting...")

    yield

    # Application shutdown
    print("DevMind AI backend shutting down...")


app = FastAPI(
    title="DevMind AI",
    description=(
        "Advanced AI Software Engineer Platform "
        "with Machine Learning, Code Generation, "
        "Automated Debugging, and Intelligent Code Review."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Frontend access configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


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
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "message": "DevMind AI API is operational",
            "version": "1.0.0",
            "modules": {
                "code_generation": "planned",
                "debugging": "planned",
                "code_review": "planned",
                "machine_learning": "planned",
                "repository_analysis": "planned",
            },
        },
    )
  
