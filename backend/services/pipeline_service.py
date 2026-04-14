"""
Advanced Pipeline Service - Step-by-Step Content Generation Pipeline
Handles multi-stage AI content generation with detailed progress tracking.
"""

import asyncio
import uuid
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field

from sqlalchemy.orm import Session
from sqlalchemy import update

from models.models import PipelineJob, PipelineStep
from services.ai_orchestrator import AIOrchestrator
from services.serper_client import SerperClient
from database import SessionLocal


# Pipeline step types
PIPELINE_STEPS = [
    {"id": 1, "name": "SEO Research", "type": "seo_research", "description": "Research keywords and competition", "icon": "search"},
    {"id": 2, "name": "Topic Analysis", "type": "topic_analysis", "description": "Analyze topic trends and opportunities", "icon": "trending_up"},
    {"id": 3, "name": "Script Generation", "type": "script_generation", "description": "Generate video script with hooks", "icon": "edit"},
    {"id": 4, "name": "Description Writer", "type": "description_writer", "description": "Write optimized descriptions", "icon": "file_text"},
    {"id": 5, "name": "Thumbnail Concept", "type": "thumbnail_concept", "description": "Generate thumbnail ideas", "icon": "image"},
    {"id": 6, "name": "Social Posts", "type": "social_posts", "description": "Create social media posts", "icon": "share"},
    {"id": 7, "name": "Hashtag Strategy", "type": "hashtag_strategy", "description": "Generate hashtag recommendations", "icon": "hash"},
    {"id": 8, "name": "SEO Optimization", "type": "seo_optimization", "description": "Optimize for search engines", "icon": "globe"},
]


@dataclass
class PipelineConfig:
    """Configuration for a pipeline run"""
    topic: str
    enabled_steps: List[int] = field(default_factory=lambda: [1, 2, 3, 4, 5, 6])
    model_preferences: Dict[str, str] = field(default_factory=dict)
    seo_provider: str = "serper"
    content_type: str = "youtube"


@dataclass
class StepResult:
    """Result from a pipeline step"""
    step_type: str
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    duration_seconds: int = 0
    model_used: Optional[str] = None


class PipelineService:
    """Advanced pipeline service for step-by-step content generation"""
    
    def __init__(self, api_keys: Dict[str, str]):
        self.api_keys = api_keys
        self.orchestrator = AIOrchestrator(api_keys)
        self.serper = SerperClient(api_keys.get("serper", ""))
    
    def get_available_steps(self) -> List[Dict[str, Any]]:
        """Get list of available pipeline steps"""
        return PIPELINE_STEPS
    
    def get_step_config(self, step_type: str) -> Dict[str, Any]:
        """Get configuration for a specific step type"""
        for step in PIPELINE_STEPS:
            if step["type"] == step_type:
                return step
        return {}
    
    async def execute_step(
        self, 
        step_type: str, 
        context: Dict[str, Any], 
        model_pref: str = "openrouter",
        model: str = "meta-llama/llama-3-8b-instruct:free"
    ) -> StepResult:
        """Execute a single pipeline step"""
        start_time = datetime.now()
        
        try:
            if step_type == "seo_research":
                result = await self._execute_seo_research(context, model_pref, model)
            elif step_type == "topic_analysis":
                result = await self._execute_topic_analysis(context, model_pref, model)
            elif step_type == "script_generation":
                result = await self._execute_script_generation(context, model_pref, model)
            elif step_type == "description_writer":
                result = await self._execute_description_writer(context, model_pref, model)
            elif step_type == "thumbnail_concept":
                result = await self._execute_thumbnail_concept(context, model_pref, model)
            elif step_type == "social_posts":
                result = await self._execute_social_posts(context, model_pref, model)
            elif step_type == "hashtag_strategy":
                result = await self._execute_hashtag_strategy(context, model_pref, model)
            elif step_type == "seo_optimization":
                result = await self._execute_seo_optimization(context, model_pref, model)
            else:
                result = StepResult(
                    step_type=step_type,
                    success=False,
                    error=f"Unknown step type: {step_type}"
                )
            
            # Calculate duration
            duration = int((datetime.now() - start_time).total_seconds())
            result.duration_seconds = duration
            
            return result
            
        except Exception as e:
            duration = int((datetime.now() - start_time).total_seconds())
            return StepResult(
                step_type=step_type,
                success=False,
                error=str(e),
                duration_seconds=duration
            )
    
    async def _execute_seo_research(
        self, 
        context: Dict[str, Any], 
        model_pref: str, 
        model: str
    ) -> StepResult:
        """Execute SEO research step"""
        topic = context.get("topic", "")
        
        # Use Serper for keyword research
        keywords_data = await self.serper.search(f"{topic} keywords", num=10)
        
        competition_data = await self.serper.search(f"{topic} competition analysis", num=5)
        
        return StepResult(
            step_type="seo_research",
            success=True,
            data={
                "keywords": keywords_data.get("organic", []),
                "competition": competition_data.get("organic", []),
                "top_keywords": [
                    {"keyword": kw.get("title", ""), "volume": "10K-100K", "difficulty": "medium"}
                    for kw in keywords_data.get("organic", [])[:5]
                ]
            }
        )
    
    async def _execute_topic_analysis(
        self, 
        context: Dict[str, Any], 
        model_pref: str, 
        model: str
    ) -> StepResult:
        """Execute topic analysis step"""
        topic = context.get("topic", "")
        
        prompt = f"""Analyze this topic for content creation: {topic}

Provide analysis in JSON format:
{{
    "trending_aspects": ["aspect1", "aspect2"],
    "audience_interest": "high/medium/low",
    "competition_level": "high/medium/low",
    "content_angle": "main angle idea",
    "unique_angle": "what makes this different",
    "pain_points": ["pain point 1", "pain point 2"],
    "opportunities": ["opportunity 1", "opportunity 2"]
}}"""
        
        system_prompt = "You are a content strategy expert. Always respond in valid JSON."
        
        response = await self.orchestrator.process(
            tool_id="topic_analysis",
            prompt=prompt,
            model_pref=model_pref,
            system_prompt=system_prompt,
            model=model
        )
        
        if "error" in response:
            return StepResult(
                step_type="topic_analysis",
                success=False,
                error=response["error"]
            )
        
        return StepResult(
            step_type="topic_analysis",
            success=True,
            data=response.get("data", {}),
            model_used=response.get("model_used")
        )
    
    async def _execute_script_generation(
        self, 
        context: Dict[str, Any], 
        model_pref: str, 
        model: str
    ) -> StepResult:
        """Execute script generation step"""
        topic = context.get("topic", "")
        seo_data = context.get("seo_research", {})
        analysis = context.get("topic_analysis", {})
        
        prompt = f"""Create a compelling video script for topic: {topic}

Context from research:
- Keywords: {seo_data.get('top_keywords', [])}
- Content angle: {analysis.get('content_angle', '')}

Generate a complete YouTube script in JSON format:
{{
    "title": "Video title",
    "hook": "Attention-grabbing opening (first 15 seconds)",
    "intro": "Introduction that sets up the video",
    "sections": [
        {{
            "heading": "Section title",
            "content": "Section content",
            "timestamp": "0:00",
            "key_points": ["point1", "point2"]
        }}
    ],
    "call_to_action": "End screen CTA",
    "script_duration": "estimated minutes",
    "seo_title": "SEO-optimized title",
    "seo_description": "SEO description (under 200 chars)"
}}

Make it engaging, well-structured, and optimized for both viewers and algorithms."""
        
        system_prompt = "You are an expert YouTube content creator. Always respond in valid JSON."
        
        response = await self.orchestrator.process(
            tool_id="script_generation",
            prompt=prompt,
            model_pref=model_pref,
            system_prompt=system_prompt,
            model=model
        )
        
        if "error" in response:
            return StepResult(
                step_type="script_generation",
                success=False,
                error=response["error"]
            )
        
        return StepResult(
            step_type="script_generation",
            success=True,
            data=response.get("data", {}),
            model_used=response.get("model_used")
        )
    
    async def _execute_description_writer(
        self, 
        context: Dict[str, Any], 
        model_pref: str, 
        model: str
    ) -> StepResult:
        """Execute description writer step"""
        topic = context.get("topic", "")
        script = context.get("script_generation", {})
        
        prompt = f"""Write optimized YouTube description for topic: {topic}

Script title: {script.get('title', '')}

Generate in JSON format:
{{
    "description": "Full description with timestamps and links",
    "timestamps": [
        {{"time": "0:00", "label": "Intro"}},
        {{"time": "1:30", "label": "Main topic"}}
    ],
    "links": [
        {{"text": "Link text", "url": "https://..."}}
    ],
    "keywords": ["keyword1", "keyword2"],
    "cta_section": "Call to action text"
}}

Include relevant timestamps, links placeholder, and compelling CTA."""
        
        system_prompt = "You are a YouTube optimization expert. Always respond in valid JSON."
        
        response = await self.orchestrator.process(
            tool_id="description_writer",
            prompt=prompt,
            model_pref=model_pref,
            system_prompt=system_prompt,
            model=model
        )
        
        if "error" in response:
            return StepResult(
                step_type="description_writer",
                success=False,
                error=response["error"]
            )
        
        return StepResult(
            step_type="description_writer",
            success=True,
            data=response.get("data", {}),
            model_used=response.get("model_used")
        )
    
    async def _execute_thumbnail_concept(
        self, 
        context: Dict[str, Any], 
        model_pref: str, 
        model: str
    ) -> StepResult:
        """Execute thumbnail concept generation step"""
        topic = context.get("topic", "")
        script = context.get("script_generation", {})
        
        prompt = f"""Generate thumbnail concepts for: {topic}
Video title: {script.get('title', '')}

Generate 3 thumbnail concepts in JSON format:
{{
    "concepts": [
        {{
            "title": "Thumbnail concept title",
            "description": "Visual description",
            "text_overlay": "Text to include",
            "color_scheme": "Color palette",
            "emotion": "Emotion to convey",
            "click_bait_score": "7/10"
        }}
    ],
    "tips": ["tip1", "tip2"],
    "avoid": ["element1", "element2"]
}}

Make them attention-grabbing and click-worthy."""
        
        system_prompt = "You are a thumbnail design expert. Always respond in valid JSON."
        
        response = await self.orchestrator.process(
            tool_id="thumbnail_concept",
            prompt=prompt,
            model_pref=model_pref,
            system_prompt=system_prompt,
            model=model
        )
        
        if "error" in response:
            return StepResult(
                step_type="thumbnail_concept",
                success=False,
                error=response["error"]
            )
        
        return StepResult(
            step_type="thumbnail_concept",
            success=True,
            data=response.get("data", {}),
            model_used=response.get("model_used")
        )
    
    async def _execute_social_posts(
        self, 
        context: Dict[str, Any], 
        model_pref: str, 
        model: str
    ) -> StepResult:
        """Execute social media posts generation step"""
        topic = context.get("topic", "")
        script = context.get("script_generation", {})
        
        prompt = f"""Create social media posts for: {topic}
Video title: {script.get('title', '')}

Generate posts for Twitter/X, Instagram, and TikTok in JSON format:
{{
    "twitter": {{
        "post": "Tweet text",
        "hashtags": "#topic #content"
    }},
    "instagram": {{
        "caption": "Instagram caption",
        "hashtags": "#hashtags",
        "story_idea": "Story concept"
    }},
    "tiktok": {{
        "caption": "TikTok caption",
        "sounds": ["sound1", "sound2"],
        "trends": ["trend1", "trend2"]
    }},
    "scheduling": "Best times to post"
}}

Make them engaging and platform-specific."""
        
        system_prompt = "You are a social media marketing expert. Always respond in valid JSON."
        
        response = await self.orchestrator.process(
            tool_id="social_posts",
            prompt=prompt,
            model_pref=model_pref,
            system_prompt=system_prompt,
            model=model
        )
        
        if "error" in response:
            return StepResult(
                step_type="social_posts",
                success=False,
                error=response["error"]
            )
        
        return StepResult(
            step_type="social_posts",
            success=True,
            data=response.get("data", {}),
            model_used=response.get("model_used")
        )
    
    async def _execute_hashtag_strategy(
        self, 
        context: Dict[str, Any], 
        model_pref: str, 
        model: str
    ) -> StepResult:
        """Execute hashtag strategy generation step"""
        topic = context.get("topic", "")
        seo_data = context.get("seo_research", {})
        
        prompt = f"""Generate hashtag strategy for: {topic}
Target keywords: {seo_data.get('top_keywords', [])}

Generate hashtags in JSON format:
{{
    "primary_hashtags": ["#topic"],
    "secondary_hashtags": ["#related"],
    "niche_hashtags": ["#specific"],
    "trending_hashtags": ["#trending"],
    "long_tail_hashtags": ["#long-tail-phrase"],
    "mix_recommendation": "70% niche, 20% related, 10% trending",
    "total_suggested": 15
}}

Optimize for maximum reach and engagement."""
        
        system_prompt = "You are a hashtag strategy expert. Always respond in valid JSON."
        
        response = await self.orchestrator.process(
            tool_id="hashtag_strategy",
            prompt=prompt,
            model_pref=model_pref,
            system_prompt=system_prompt,
            model=model
        )
        
        if "error" in response:
            return StepResult(
                step_type="hashtag_strategy",
                success=False,
                error=response["error"]
            )
        
        return StepResult(
            step_type="hashtag_strategy",
            success=True,
            data=response.get("data", {}),
            model_used=response.get("model_used")
        )
    
    async def _execute_seo_optimization(
        self, 
        context: Dict[str, Any], 
        model_pref: str, 
        model: str
    ) -> StepResult:
        """Execute SEO optimization step"""
        topic = context.get("topic", "")
        script = context.get("script_generation", {})
        description = context.get("description_writer", {})
        
        prompt = f"""Optimize content for SEO: {topic}
Title: {script.get('title', '')}
Description: {description.get('description', '')}

Generate SEO optimizations in JSON format:
{{
    "meta_title": "SEO title (60 chars)",
    "meta_description": "SEO description (160 chars)",
    "focus_keyword": "primary keyword",
    "secondary_keywords": ["keyword1", "keyword2"],
    "schema_markup": {{"@type": "VideoObject"}},
    "internal_links": ["link ideas"],
    "external_links": ["authority sources"],
    "readability_score": "8/10",
    "seo_score": "85/100"
}}

Make it fully optimized for search engines."""
        
        system_prompt = "You are an SEO expert. Always respond in valid JSON."
        
        response = await self.orchestrator.process(
            tool_id="seo_optimization",
            prompt=prompt,
            model_pref=model_pref,
            system_prompt=system_prompt,
            model=model
        )
        
        if "error" in response:
            return StepResult(
                step_type="seo_optimization",
                success=False,
                error=response["error"]
            )
        
        return StepResult(
            step_type="seo_optimization",
            success=True,
            data=response.get("data", {}),
            model_used=response.get("model_used")
        )
    
    async def run_pipeline(
        self,
        config: PipelineConfig,
        db: Session,
        progress_callback: Optional[callable] = None
    ) -> Dict[str, Any]:
        """Run the complete pipeline with step-by-step execution"""
        
        # Generate job ID
        job_id = f"JOB-{uuid.uuid4().hex[:6].upper()}"
        
        # Get enabled steps
        enabled_steps = [
            step for step in PIPELINE_STEPS 
            if step["id"] in config.enabled_steps
        ]
        
        # Create initial job record
        job = PipelineJob(
            id=job_id,
            topic=config.topic,
            status="processing",
            progress=0,
            current_step=enabled_steps[0]["name"] if enabled_steps else "Starting",
            total_steps=len(enabled_steps),
            completed_steps=0,
            result_data={}
        )
        db.add(job)
        db.commit()
        
        # Initialize context for passing data between steps
        context = {"topic": config.topic}
        
        # Execute each step sequentially
        for idx, step in enumerate(enabled_steps):
            step_type = step["type"]
            step_name = step["name"]
            
            # Update job progress
            job.current_step = step_name
            job.progress = int((idx / len(enabled_steps)) * 100)
            db.commit()
            
            # Notify progress callback if provided
            if progress_callback:
                await progress_callback({
                    "job_id": job_id,
                    "current_step": step_name,
                    "step_progress": 0,
                    "total_progress": job.progress,
                    "status": "processing"
                })
            
            # Create step record
            step_record = PipelineStep(
                job_id=job_id,
                step_order=idx + 1,
                step_name=step_name,
                step_type=step_type,
                status="processing",
                started_at=datetime.now()
            )
            db.add(step_record)
            db.commit()
            
            # Execute the step
            result = await self.execute_step(
                step_type=step_type,
                context=context,
                model_pref=config.model_preferences.get("model_pref", "openrouter"),
                model=config.model_preferences.get("model", "meta-llama/llama-3-8b-instruct:free")
            )
            
            # Update step record
            step_record.status = "completed" if result.success else "failed"
            step_record.progress = 100 if result.success else 0
            step_record.output_data = result.data
            step_record.error_message = result.error
            step_record.completed_at = datetime.now()
            step_record.duration_seconds = result.duration_seconds
            step_record.model_used = result.model_used
            db.commit()
            
            # Add result to context for next steps
            context[step_type] = result.data
            
            # Update job result data
            job.result_data[step_type] = result.data
            job.completed_steps = idx + 1
            db.commit()
            
            # Notify progress callback
            if progress_callback:
                await progress_callback({
                    "job_id": job_id,
                    "current_step": step_name,
                    "step_progress": 100,
                    "total_progress": int(((idx + 1) / len(enabled_steps)) * 100),
                    "status": "processing" if idx < len(enabled_steps) - 1 else "completed"
                })
            
            # If step failed, stop pipeline
            if not result.success:
                job.status = "failed"
                job.error_message = result.error
                job.progress = int((idx / len(enabled_steps)) * 100)
                db.commit()
                break
        
        # Mark job as completed if all steps succeeded
        if job.status == "processing":
            job.status = "completed"
            job.progress = 100
            job.current_step = "Done"
            db.commit()
        
        return {
            "job_id": job_id,
            "status": job.status,
            "topic": config.topic,
            "result": job.result_data,
            "total_steps": len(enabled_steps),
            "completed_steps": job.completed_steps
        }


# Singleton instance management
_pipeline_service: Optional[PipelineService] = None


def get_pipeline_service(api_keys: Dict[str, str]) -> PipelineService:
    """Get or create pipeline service instance"""
    global _pipeline_service
    if _pipeline_service is None:
        _pipeline_service = PipelineService(api_keys)
    return _pipeline_service
