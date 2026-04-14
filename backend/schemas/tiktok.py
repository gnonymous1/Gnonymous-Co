from pydantic import BaseModel, Field
from typing import Optional


class HookRequest(BaseModel):
    topic: str = Field(..., description="Content topic")
    target_audience: str = Field(default="general", description="Target audience description")
    tone: str = Field(default="engaging", description="Content tone")
    model_pref: str = Field(default="gemini")


class Hook(BaseModel):
    text: str
    style: str  # question|shock|story|challenge|controversy
    estimated_retention: str
    why_it_works: str


class HookResponse(BaseModel):
    topic: str
    hooks: list[Hook]
    model_used: str


class TrendScoutRequest(BaseModel):
    category: str = Field(default="general", description="Content category")
    country: str = Field(default="us", description="Country code")
    model_pref: str = Field(default="gemini")


class TrendingAudio(BaseModel):
    name: str
    artist: str
    usage_count: str
    trend_velocity: str  # Rising|Peak|Declining


class TrendingHashtag(BaseModel):
    tag: str
    views: str
    growth: str


class TrendingFormat(BaseModel):
    format: str
    description: str
    example: str


class TrendScoutResponse(BaseModel):
    trending_audios: list[TrendingAudio]
    trending_hashtags: list[TrendingHashtag]
    trending_formats: list[TrendingFormat]
    recommendation: str
    model_used: str


class ConvertScriptRequest(BaseModel):
    long_content: str = Field(..., min_length=50, description="Long-form content to convert")
    platform: str = Field(default="tiktok", description="tiktok|instagram|youtube_shorts")
    model_pref: str = Field(default="gemini")


class ShortScript(BaseModel):
    hook: str
    script: str
    duration: str
    word_count: int
    cta: str


class ConvertScriptResponse(BaseModel):
    scripts: list[ShortScript]
    model_used: str


class EngagementRequest(BaseModel):
    profile_url: str = Field(..., description="TikTok profile URL or handle")
    model_pref: str = Field(default="gemini")


class TopPerforming(BaseModel):
    theme: str
    performance: str  # High|Medium|Low


class EngagementResponse(BaseModel):
    avg_views: str
    avg_likes: str
    engagement_rate: str
    best_time: str
    top_performing: list[TopPerforming]
    recommendations: list[str]
    model_used: str


class PostRankRequest(BaseModel):
    keyword: str = Field(..., description="Target keyword or hashtag")
    video_url: Optional[str] = None
    hashtags: list[str] = Field(default_factory=list)
    model_pref: str = Field(default="gemini")


class TopPost(BaseModel):
    caption: str
    views: str
    engagement: str
    hashtags: str
    velocity: str  # Rising|Stable|Declining


class PostRankResponse(BaseModel):
    top_posts: list[TopPost]
    optimization_tips: list[str]
    model_used: str
