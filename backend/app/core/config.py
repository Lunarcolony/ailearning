from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Research Discovery API"
    api_prefix: str = "/v1"
    # Example format: ******host:5432/dbname
    database_url: str
    redis_url: str = "redis://localhost:6379/0"
    ollama_url: str = "http://localhost:11434"


settings = Settings()
