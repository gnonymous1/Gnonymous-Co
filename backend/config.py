from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Gnonymous Intelligence OS"
    DEBUG: bool = True
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./apex_content_os.db"

    # Auth
    NEXTAUTH_SECRET: str = "apex-secret-key-change-in-production"
    JWT_SECRET: str = "apex-jwt-secret-change-in-production"
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    # AI Model Keys (set via API Key Center or .env)
    GEMINI_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""
    NVIDIA_API_KEY: str = ""

    # Data Layer Keys
    SERPER_API_KEY: str = ""
    YOUTUBE_API_KEY: str = ""

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PRO_PRICE_ID: str = "price_pro_monthly"
    STRIPE_AGENCY_PRICE_ID: str = "price_agency_monthly"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
