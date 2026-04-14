from pydantic import BaseModel, Field
from typing import Optional


# --- API Keys ---


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


# --- Model Preferences ---


class ModelPreferencesUpdate(BaseModel):
    seo: str = Field(default="gemini", description="gemini|openrouter|nvidia")
    youtube: str = Field(default="gemini", description="gemini|openrouter|nvidia")
    tiktok: str = Field(default="gemini", description="gemini|openrouter|nvidia")
    ai_content: str = Field(default="gemini", description="gemini|openrouter|nvidia")


class ModelPreferencesResponse(BaseModel):
    seo: str
    youtube: str
    tiktok: str
    ai_content: str


# --- Workspace ---


class WorkspaceUserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., pattern=r"^[^@]+@[^@]+\.[^@]+$")
    role: str = Field(default="editor", pattern=r"^(admin|editor|viewer)$")


class WorkspaceUserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[str] = Field(None, pattern=r"^[^@]+@[^@]+\.[^@]+$")
    role: Optional[str] = Field(None, pattern=r"^(admin|editor|viewer)$")


class WorkspaceUserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    created_at: Optional[str] = None


# --- Usage ---


class UsageStats(BaseModel):
    total_tokens: int = 0
    total_cost: float = 0.0
    total_calls: int = 0
    calls_by_model: dict = {}


class UsageLogEntry(BaseModel):
    id: str
    tool_id: str
    model_used: str
    tokens_input: Optional[int] = None
    tokens_output: Optional[int] = None
    cost_usd: Optional[float] = None
    created_at: str


# --- Archive ---


class ArchiveEntry(BaseModel):
    id: str
    tool_id: str
    input_data: dict
    output_data: dict
    model_used: Optional[str] = None
    created_at: str


class ArchiveCreate(BaseModel):
    project_id: Optional[str] = None
    tool_id: str
    input_data: dict
    output_data: dict
    model_used: Optional[str] = None
