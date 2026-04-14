"""
Advanced Pipeline Router - API endpoints for step-by-step pipeline management
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from database import SessionLocal
from models.models import PipelineJob, PipelineStep
from services.pipeline_service import PipelineService, PipelineConfig, PIPELINE_STEPS, get_pipeline_service
from config import get_settings


router = APIRouter(prefix="", tags=["pipeline"])


# ─── Request/Response Models ───────────────────────────────────────────────────

class PipelineStepConfig(BaseModel):
    id: int
    name: str
    type: str
    description: str
    enabled: bool = True


class PipelineRunRequest(BaseModel):
    topic: str
    enabled_steps: List[int] = [1, 2, 3, 4, 5, 6]
    model_pref: str = "openrouter"
    model: str = "meta-llama/llama-3-8b-instruct:free"


class PipelineJobResponse(BaseModel):
    id: str
    topic: str
    status: str
    progress: int
    current_step: str
    total_steps: int
    completed_steps: int
    result_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None


class PipelineStepResponse(BaseModel):
    id: int
    job_id: str
    step_order: int
    step_name: str
    step_type: str
    status: str
    progress: int
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    duration_seconds: int = 0
    model_used: Optional[str] = None


# ─── Dependencies ───────────────────────────────────────────────────────────────

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_pipeline_svc() -> PipelineService:
    settings = get_settings()
    api_keys = {
        "gemini_api_key": settings.GEMINI_API_KEY,
        "openrouter_api_key": settings.OPENROUTER_API_KEY,
        "serper_api_key": settings.SERPER_API_KEY,
        "youtube_api_key": settings.YOUTUBE_API_KEY,
    }
    return get_pipeline_service(api_keys)


# ─── Pipeline Endpoints ─────────────────────────────────────────────────────────

@router.get("/steps")
async def get_pipeline_steps():
    """Get available pipeline steps with their configurations"""
    return {
        "steps": [
            {
                "id": step["id"],
                "name": step["name"],
                "type": step["type"],
                "description": step["description"],
                "icon": step["icon"]
            }
            for step in PIPELINE_STEPS
        ]
    }


@router.post("/run")
async def run_pipeline(
    request: PipelineRunRequest,
    db: Session = Depends(get_db),
    pipeline: PipelineService = Depends(get_pipeline_svc)
):
    """Start a new pipeline run with selected steps"""
    try:
        config = PipelineConfig(
            topic=request.topic,
            enabled_steps=request.enabled_steps,
            model_preferences={
                "model_pref": request.model_pref,
                "model": request.model
            }
        )
        
        result = await pipeline.run_pipeline(config, db)
        
        return {
            "success": True,
            "job_id": result["job_id"],
            "message": f"Pipeline started for topic: {request.topic}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/jobs")
async def get_pipeline_jobs(
    limit: int = 20,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all pipeline jobs with optional filtering"""
    query = db.query(PipelineJob)
    
    if status:
        query = query.filter(PipelineJob.status == status)
    
    jobs = query.order_by(PipelineJob.created_at.desc()).limit(limit).all()
    
    return {
        "jobs": [
            {
                "id": job.id,
                "topic": job.topic,
                "status": job.status,
                "progress": job.progress,
                "current_step": job.current_step,
                "total_steps": job.total_steps,
                "completed_steps": job.completed_steps,
                "error_message": job.error_message,
                "created_at": job.created_at.isoformat() if job.created_at else None,
                "updated_at": job.updated_at.isoformat() if job.updated_at else None
            }
            for job in jobs
        ]
    }


@router.get("/jobs/{job_id}")
async def get_pipeline_job(
    job_id: str,
    db: Session = Depends(get_db)
):
    """Get detailed information about a specific pipeline job"""
    job = db.query(PipelineJob).filter(PipelineJob.id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    
    # Get steps for this job
    steps = db.query(PipelineStep).filter(
        PipelineStep.job_id == job_id
    ).order_by(PipelineStep.step_order).all()
    
    return {
        "job": {
            "id": job.id,
            "topic": job.topic,
            "status": job.status,
            "progress": job.progress,
            "current_step": job.current_step,
            "total_steps": job.total_steps,
            "completed_steps": job.completed_steps,
            "result_data": job.result_data,
            "error_message": job.error_message,
            "created_at": job.created_at.isoformat() if job.created_at else None,
            "updated_at": job.updated_at.isoformat() if job.updated_at else None
        },
        "steps": [
            {
                "id": step.id,
                "step_order": step.step_order,
                "step_name": step.step_name,
                "step_type": step.step_type,
                "status": step.status,
                "progress": step.progress,
                "output_data": step.output_data,
                "error_message": step.error_message,
                "duration_seconds": step.duration_seconds,
                "model_used": step.model_used,
                "started_at": step.started_at.isoformat() if step.started_at else None,
                "completed_at": step.completed_at.isoformat() if step.completed_at else None
            }
            for step in steps
        ]
    }


@router.get("/jobs/{job_id}/steps")
async def get_job_steps(
    job_id: str,
    db: Session = Depends(get_db)
):
    """Get all steps for a specific job"""
    steps = db.query(PipelineStep).filter(
        PipelineStep.job_id == job_id
    ).order_by(PipelineStep.step_order).all()
    
    return {
        "steps": [
            {
                "id": step.id,
                "step_order": step.step_order,
                "step_name": step.step_name,
                "step_type": step.step_type,
                "status": step.status,
                "progress": step.progress,
                "output_data": step.output_data,
                "error_message": step.error_message,
                "duration_seconds": step.duration_seconds,
                "model_used": step.model_used,
                "started_at": step.started_at.isoformat() if step.started_at else None,
                "completed_at": step.completed_at.isoformat() if step.completed_at else None
            }
            for step in steps
        ]
    }


@router.get("/jobs/{job_id}/result")
async def get_job_result(
    job_id: str,
    db: Session = Depends(get_db)
):
    """Get the final result data for a completed job"""
    job = db.query(PipelineJob).filter(PipelineJob.id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    
    if job.status != "completed":
        raise HTTPException(
            status_code=400, 
            detail=f"Job is {job.status}, result not available yet"
        )
    
    return {
        "job_id": job.id,
        "topic": job.topic,
        "status": job.status,
        "result": job.result_data,
        "total_steps": job.total_steps,
        "completed_steps": job.completed_steps
    }


@router.delete("/jobs/{job_id}")
async def delete_pipeline_job(
    job_id: str,
    db: Session = Depends(get_db)
):
    """Delete a pipeline job and its associated steps"""
    job = db.query(PipelineJob).filter(PipelineJob.id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    
    # Delete associated steps first
    db.query(PipelineStep).filter(PipelineStep.job_id == job_id).delete()
    
    # Delete the job
    db.delete(job)
    db.commit()
    
    return {
        "success": True,
        "message": f"Job {job_id} deleted successfully"
    }


@router.get("/stats")
async def get_pipeline_stats(
    db: Session = Depends(get_db)
):
    """Get pipeline statistics"""
    total_jobs = db.query(PipelineJob).count()
    processing = db.query(PipelineJob).filter(PipelineJob.status == "processing").count()
    completed = db.query(PipelineJob).filter(PipelineJob.status == "completed").count()
    failed = db.query(PipelineJob).filter(PipelineJob.status == "failed").count()
    
    success_rate = (completed / total_jobs * 100) if total_jobs > 0 else 0
    
    # Get recent jobs
    recent_jobs = db.query(PipelineJob).order_by(
        PipelineJob.created_at.desc()
    ).limit(5).all()
    
    return {
        "stats": {
            "total_jobs": total_jobs,
            "processing": processing,
            "completed": completed,
            "failed": failed,
            "success_rate": round(success_rate, 1)
        },
        "recent_jobs": [
            {
                "id": job.id,
                "topic": job.topic,
                "status": job.status,
                "progress": job.progress,
                "created_at": job.created_at.isoformat() if job.created_at else None
            }
            for job in recent_jobs
        ]
    }


# ─── SSE for Real-time Updates ─────────────────────────────────────────────────

@router.get("/jobs/{job_id}/stream")
async def stream_job_updates(
    job_id: str,
    db: Session = Depends(get_db)
):
    """Stream job updates using Server-Sent Events (SSE)"""
    import asyncio
    import json
    from fastapi.responses import StreamingResponse
    
    async def event_generator():
        last_update = None
        
        while True:
            # Get current job state
            job = db.query(PipelineJob).filter(PipelineJob.id == job_id).first()
            
            if not job:
                yield f"data: {json.dumps({'error': 'Job not found'})}\n\n"
                break
            
            current_state = {
                "job_id": job.id,
                "status": job.status,
                "progress": job.progress,
                "current_step": job.current_step,
                "completed_steps": job.completed_steps,
                "total_steps": job.total_steps
            }
            
            # Only send update if changed
            if current_state != last_update:
                yield f"data: {json.dumps(current_state)}\n\n"
                last_update = current_state
            
            # Check if job is finished
            if job.status in ["completed", "failed"]:
                break
            
            # Wait before next check
            await asyncio.sleep(2)
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )
