
import json
from functools import lru_cache
from typing import Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "DevMind AI"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False

    SECRET_KEY: str = "change-this-development-secret-key"

    DATABASE_URL: str = "sqlite:///./devmind.db"

    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"

    GITHUB_TOKEN: str | None = None

    AI_API_KEY: str | None = None
    AI_MODEL: str = "gpt-4.1-mini"

    MAX_CODE_LENGTH: int = 50000
    MAX_UPLOAD_SIZE_MB: int = 10

    MODEL_STORAGE_PATH: str = "./models"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Any) -> Any:
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                return [
                    origin.strip()
                    for origin in value.split(",")
                    if origin.strip()
                ]

        return value

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, value: str) -> str:
        if len(value) < 32:
            raise ValueError(
                "SECRET_KEY must contain at least 32 characters."
            )

        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
