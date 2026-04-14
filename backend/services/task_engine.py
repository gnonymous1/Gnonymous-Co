import asyncio
import uuid
import logging
from datetime import datetime
from typing import Any, Dict, Optional, Callable, Awaitable
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from models.models import PipelineJob, PipelineStep
from database import AsyncSessionLocal

logger = logging.getLogger(__name__)

class TaskEngine:
    """
    Core engine for background task execution.
    Handles enqueuing, state tracking, and lifecycle management.
    """
    
    def __init__(self):
        self.queue = asyncio.Queue()
        self.worker_task = None
        self._running = False

    async def start(self):
        """Start the background worker."""
        if self._running:
            return
        self._running = True
        self.worker_task = asyncio.create_task(self._worker_loop())
        logger.info("[TaskEngine] Background worker started.")

    async def stop(self):
        """Stop the background worker."""
        self._running = False
        if self.worker_task:
            self.worker_task.cancel()
            try:
                await self.worker_task
            except asyncio.CancelledError:
                pass
        logger.info("[TaskEngine] Background worker stopped.")

    async def enqueue_job(self, topic: str, total_steps: int) -> str:
        """Create a new job and add to queue."""
        job_id = str(uuid.uuid4())
        
        async with AsyncSessionLocal() as db:
            job = PipelineJob(
                id=job_id,
                topic=topic,
                status="PENDING",
                total_steps=total_steps,
                progress=0
            )
            db.add(job)
            await db.commit()
            
        await self.queue.put(job_id)
        logger.info(f"[TaskEngine] Job {job_id} enqueued: {topic}")
        return job_id

    async def _worker_loop(self):
        """Infinite loop processing tasks from the queue."""
        while self._running:
            job_id = await self.queue.get()
            try:
                await self._process_job(job_id)
            except Exception as e:
                logger.error(f"[TaskEngine] Error processing job {job_id}: {e}")
                await self._update_job_status(job_id, "FAILED", error=str(e))
            finally:
                self.queue.task_done()

    async def _process_job(self, job_id: str):
        """Main execution logic for a job."""
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(PipelineJob).where(PipelineJob.id == job_id))
            job = result.scalar_one_or_none()
            if not job:
                return

            job.status = "RUNNING"
            job.updated_at = datetime.utcnow()
            await db.commit()

            # For now, we simulate steps or call delegates.
            # In a real implementation, we would look up the job type/steps.
            logger.info(f"[TaskEngine] Job {job_id} is running...")

    async def _update_job_status(self, job_id: str, status: str, error: Optional[str] = None):
        async with AsyncSessionLocal() as db:
            await db.execute(
                update(PipelineJob)
                .where(PipelineJob.id == job_id)
                .values(status=status, error_message=error, updated_at=datetime.utcnow())
            )
            await db.commit()

# Global engine instance
task_engine = TaskEngine()

def get_task_engine() -> TaskEngine:
    return task_engine
