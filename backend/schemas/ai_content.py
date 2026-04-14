from pydantic import BaseModel, Field
from typing import Optional


class HumanizeRequest(BaseModel):
    content: str = Field(..., min_length=10, description="AI content to humanize")
    tone: str = Field(default="professional", description="Target tone")
    reading_level: str = Field(default="conversational", description="Target reading level")
    model_pref: str = Field(default="gemini")


class HumanizeResponse(BaseModel):
    humanized_text: str
    ai_score: str
    readability: str
    uniqueness: str
    changes_made: list[str]
    model_used: str


class AdCopyRequest(BaseModel):
    product: str = Field(..., description="Product or service description")
    platform: str = Field(default="all", description="facebook|google|instagram|all")
    audience: str = Field(default="general", description="Target audience")
    budget: str = Field(default="medium", description="low|medium|high")
    model_pref: str = Field(default="gemini")


class FacebookAd(BaseModel):
    headline: str
    primary_text: str
    description: str
    cta: str


class GoogleAd(BaseModel):
    headline_1: str
    headline_2: str
    description: str
    display_url: str


class InstagramAd(BaseModel):
    caption: str
    hashtags: str
    cta: str


class AdCopyResponse(BaseModel):
    facebook: list[FacebookAd]
    google: list[GoogleAd]
    instagram: list[InstagramAd]
    strategy_notes: str
    model_used: str


class EbookRequest(BaseModel):
    topic: str = Field(..., description="eBook topic")
    chapters: int = Field(default=7, ge=3, le=20, description="Number of chapters")
    audience: str = Field(default="general", description="Target audience")
    model_pref: str = Field(default="gemini")


class ChapterContent(BaseModel):
    title: str
    summary: str
    key_points: list[str]
    content: Optional[str] = None


class EbookResponse(BaseModel):
    title: str
    subtitle: str
    price_suggestion: str
    chapters_list: list[ChapterContent]
    sales_page_copy: str
    model_used: str


class EmailSequenceRequest(BaseModel):
    goal: str = Field(..., description="Email campaign goal")
    sequence_length: int = Field(default=5, ge=3, le=10, description="Number of emails")
    audience: str = Field(default="general", description="Target audience")
    model_pref: str = Field(default="gemini")


class Email(BaseModel):
    subject_line: str
    subject_line_b: str
    preview_text: str
    body: str
    cta_text: str
    send_day: str
    predicted_open_rate: str


class EmailSequenceResponse(BaseModel):
    emails: list[Email]
    sequence_strategy: str
    model_used: str


class LeadScrapeRequest(BaseModel):
    niche: str = Field(..., description="Target niche")
    location: str = Field(default="", description="Geographic location")
    criteria: str = Field(default="guest_post", description="guest_post|link_building|partnerships")
    model_pref: str = Field(default="gemini")


class Lead(BaseModel):
    site_name: str
    domain: str
    url: str
    da: str
    contact_email: str
    outreach_template: str


class LeadScrapeResponse(BaseModel):
    leads: list[Lead]
    model_used: str


class SaaSValidatorRequest(BaseModel):
    idea: str = Field(..., description="SaaS idea description")
    target_market: str = Field(default="general", description="Target market")
    model_pref: str = Field(default="gemini")


class SaaSScores(BaseModel):
    market_demand: int
    competition: int
    monetization: int
    feasibility: int
    growth: int


class SaaSValidatorResponse(BaseModel):
    overall_score: str
    scores: SaaSScores
    revenue_projection: str
    competitors: list[str]
    go_to_market: str
    model_used: str
