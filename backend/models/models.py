from sqlalchemy import Column, Integer, String, JSON, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from database import Base


class User(Base):
    """Core user model for authentication and role-based access"""
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    role = Column(String, default="guest")  # guest, pro, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class APIKey(Base):
    __tablename__ = "api_keys"
    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String, unique=True, index=True)  # gemini, openrouter, serper
    key_encrypted = Column(String)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class UsageLog(Base):
    __tablename__ = "usage_logs"
    id = Column(Integer, primary_key=True, index=True)
    tool_id = Column(String, index=True)
    model = Column(String)
    tokens_used = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SavedAsset(Base):
    """Stores saved trends, hooks, and research items for persistence"""
    __tablename__ = "saved_assets"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True)  # e.g., 'tiktok_trend', 'hook', 'keyword'
    content = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PipelineJob(Base):
    """Pillar 3: Content Factory Job Tracker - Advanced Step-by-Step Pipeline"""
    __tablename__ = "pipeline_jobs"
    id = Column(String, primary_key=True, index=True)
    topic = Column(String)
    status = Column(String)  # pending, processing, completed, failed
    progress = Column(Integer, default=0)
    current_step = Column(String)
    total_steps = Column(Integer, default=0)
    completed_steps = Column(Integer, default=0)
    result_data = Column(JSON, nullable=True)
    step_details = Column(JSON, nullable=True)  # Detailed step information
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class PipelineStep(Base):
    """Individual pipeline step tracking"""
    __tablename__ = "pipeline_steps"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("pipeline_jobs.id"))
    step_order = Column(Integer)
    step_name = Column(String)
    step_type = Column(String)  # seo_research, script_generation, thumbnail, social_posts, etc.
    status = Column(String)  # pending, processing, completed, failed, skipped
    progress = Column(Integer, default=0)
    input_data = Column(JSON, nullable=True)
    output_data = Column(JSON, nullable=True)
    error_message = Column(String, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    duration_seconds = Column(Integer, default=0)
    model_used = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Archive(Base):
    """Stores archived content items for later retrieval"""
    __tablename__ = "archives"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content_type = Column(String, index=True)  # e.g., 'keyword', 'script', 'thumbnail'
    content = Column(JSON)
    tags = Column(JSON, nullable=True)
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WorkspaceUser(Base):
    """Represents a user/account connected to the workspace"""
    __tablename__ = "workspace_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    platform = Column(String, index=True)  # e.g., 'youtube', 'tiktok'
    credentials = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ModelPreference(Base):
    """Stores per-tool AI model preferences"""
    __tablename__ = "model_preferences"
    id = Column(Integer, primary_key=True, index=True)
    tool_id = Column(String, unique=True, index=True)
    provider = Column(String)   # e.g., 'openrouter', 'gemini'
    model_id = Column(String)   # e.g., 'openai/gpt-4o'
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class RankHistory(Base):
    """Tracks keyword ranking history over time"""
    __tablename__ = "rank_history"
    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String, index=True)
    rank = Column(Integer, nullable=True)
    search_volume = Column(Integer, nullable=True)
    platform = Column(String, index=True)  # e.g., 'google', 'youtube'
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())


class Project(Base):
    """Content project container"""
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    niche = Column(String, nullable=True)
    project_metadata = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
