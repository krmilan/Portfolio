from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


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
    vector_match_threshold: float = 0.75
    vector_match_count: int = 5


@lru_cache
def get_settings() -> Settings:
    return Settings()