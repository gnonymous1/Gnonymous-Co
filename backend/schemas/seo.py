from pydantic import BaseModel, Field
from typing import Optional


class SerpAnalyzeRequest(BaseModel):
    keyword: str = Field(..., min_length=1, max_length=200, description="Target keyword to analyze")
    country: str = Field(default="us", description="Country code (e.g., us, uk, pk)")
    language: str = Field(default="en", description="Language code (e.g., en, ur)")
    model_pref: str = Field(default="gemini", description="AI model preference: gemini|openrouter|nvidia")


class SerpResultItem(BaseModel):
    position: int
    title: str
    url: str
    snippet: str
    domain: str
    estimated_da: Optional[int] = None
    content_type: Optional[str] = None


class SerpInsights(BaseModel):
    avg_content_length: Optional[int] = None
    avg_da: Optional[int] = None
    content_gaps: list[str] = []
    ranking_factors: list[str] = []
    difficulty: str = "unknown"
    search_intent: str = "unknown"


class SerpAnalyzeResponse(BaseModel):
    keyword: str
    total_results: int
    top_results: list[SerpResultItem]
    insights: SerpInsights
    recommendation: str
    model_used: str
    credits_used: Optional[dict] = None


class ApiKeyUpdate(BaseModel):
    gemini: Optional[str] = ""
    openrouter: Optional[str] = ""
    nvidia: Optional[str] = ""
    serper: Optional[str] = ""
    youtube: Optional[str] = ""


class ApiKeyStatus(BaseModel):
    provider: str
    is_configured: bool
    is_valid: Optional[bool] = None
