from pydantic import BaseModel, Field
from typing import Optional


class CompetitorSpyRequest(BaseModel):
    channel_url: str = Field(..., description="YouTube channel URL or handle")
    model_pref: str = Field(default="gemini", description="AI model: gemini|openrouter|nvidia")


class RankCheckRequest(BaseModel):
    keyword: str = Field(..., description="Target keyword to rank for")
    video_url: str = Field(..., description="Your YouTube video URL")
    model_pref: str = Field(default="gemini")


class StoryboardRequest(BaseModel):
    script: str = Field(..., min_length=10, description="Video script text")
    duration: int = Field(default=300, description="Target duration in seconds")
    style: str = Field(default="cinematic", description="Video style")
    model_pref: str = Field(default="gemini")


class ThumbnailPredictRequest(BaseModel):
    title: str = Field(..., description="Video title")
    description: str = Field(default="", description="Video description")
    niche: str = Field(default="general", description="Content niche")
    model_pref: str = Field(default="gemini")


class OptimizeTagsRequest(BaseModel):
    video_title: str = Field(..., description="Your video title")
    niche: str = Field(default="general", description="Content niche")
    competitors: list[str] = Field(default_factory=list, description="Competitor channel URLs")
    model_pref: str = Field(default="gemini")


class SentimentRequest(BaseModel):
    video_url: str = Field(..., description="YouTube video URL")
    model_pref: str = Field(default="gemini")


# --- Response Models ---


class VideoSummary(BaseModel):
    title: str
    views: Optional[str] = None
    date: Optional[str] = None
    engagement: Optional[str] = None
    link: Optional[str] = None


class ChannelStats(BaseModel):
    subscribers: Optional[str] = None
    total_videos: Optional[str] = None
    avg_views: Optional[str] = None
    upload_frequency: Optional[str] = None


class CompetitorSpyResponse(BaseModel):
    channel_url: str
    channel_stats: ChannelStats
    top_videos: list[VideoSummary]
    trending_topics: list[str]
    ai_analysis: str
    model_used: str


class RankCheckResponse(BaseModel):
    keyword: str
    video_url: str
    position: Optional[int] = None
    total_results: int
    top_results: list[dict]


class ThumbnailSuggestion(BaseModel):
    concept: str
    description: str
    colors: list[str]
    text_overlay: str


class ThumbnailPredictResponse(BaseModel):
    predicted_ctr: str
    emotion_score: str
    curiosity_score: str
    suggestions: list[ThumbnailSuggestion]
    model_used: str


class SentimentResponse(BaseModel):
    positive: str
    neutral: str
    negative: str
    top_topics: list[str]
    content_requests: list[str]
    summary: str
    model_used: str
