from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Job Application Tracker"
    database_url: str = "sqlite:///./job_tracker.db"
    postgres_user: str = "postgres"
    postgres_password: str = "postgres"
    postgres_server: str = "localhost"
    postgres_db: str = "job_tracker"
    secret_key: str = "change-this-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    model_config = SettingsConfigDict(env_file=".env", env_prefix="", case_sensitive=False)


@lru_cache
def get_settings() -> Settings:
    return Settings()
