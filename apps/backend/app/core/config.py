from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator
from functools import lru_cache
import json


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    app_name: str = "Milan Ray Portfolio API"
    app_version: str = "0.1.0"
    debug: bool = False

    allowed_origins: list[str] = ["http://localhost:3000"]

    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""

    gemini_api_key: str = ""
    groq_api_key: str = ""

    embedding_model: str = "models/gemini-embedding-001"
    chat_model: str = "models/gemini-2.0-flash"
    vector_match_threshold: float = 0.35
    vector_match_count: int = 5
    
    ingest_secret: str = Field(default="change-me-secret")

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_origins(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return [o.strip() for o in v.split(",")]
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()
