from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter()

# In-memory store — replace with DB in production
_clients: dict = {
    "c1": {"id": "c1", "name": "TechFlow Media", "niche": "SaaS Marketing", "plan": "enterprise", "monthly_value": 2500, "status": "active"},
    "c2": {"id": "c2", "name": "Bloom Fitness", "niche": "Health & Wellness", "plan": "growth", "monthly_value": 1200, "status": "active"},
    "c3": {"id": "c3", "name": "FinEdge Academy", "niche": "Finance Education", "plan": "starter", "monthly_value": 600, "status": "onboarding"},
}


class ClientCreate(BaseModel):
    name: str
    niche: str = "General"
    plan: str = "starter"
    monthly_value: int = 600


class ReportRequest(BaseModel):
    client_id: str
    report_type: str  # "monthly" | "competitor" | "seo" | "content"
    brand_name: Optional[str] = None
    brand_color: Optional[str] = "#7c3aed"


@router.get("/clients")
async def list_clients():
    """List all agency clients."""
    clients = list(_clients.values())
    mrr = sum(c["monthly_value"] for c in clients)
    return {
        "clients": clients,
        "total_mrr": mrr,
        "total_arr": mrr * 12,
        "count": len(clients),
    }


@router.post("/clients")
async def create_client(req: ClientCreate):
    """Create a new client workspace."""
    client_id = f"c{uuid.uuid4().hex[:6]}"
    client = {
        "id": client_id,
        "name": req.name,
        "niche": req.niche,
        "plan": req.plan,
        "monthly_value": req.monthly_value,
        "status": "onboarding",
    }
    _clients[client_id] = client
    return {"client": client, "message": f"Client '{req.name}' created successfully."}


@router.delete("/clients/{client_id}")
async def delete_client(client_id: str):
    """Remove a client workspace."""
    if client_id not in _clients:
        raise HTTPException(status_code=404, detail="Client not found")
    del _clients[client_id]
    return {"message": f"Client {client_id} removed."}


@router.post("/reports/generate")
async def generate_report(req: ReportRequest):
    """
    Generate a white-label PDF report for a client.
    Returns a mock download URL — replace with ReportLab in production.
    """
    if req.client_id not in _clients:
        raise HTTPException(status_code=404, detail="Client not found")

    client = _clients[req.client_id]
    report_id = f"rpt_{uuid.uuid4().hex[:8]}"

    return {
        "report_id": report_id,
        "client": client["name"],
        "type": req.report_type,
        "brand_name": req.brand_name or "Apex Content OS",
        "brand_color": req.brand_color,
        "status": "ready",
        "pages": 16,
        "size_mb": 2.1,
        "download_url": f"/api/agency/reports/download/{report_id}",
        "message": f"Report '{req.report_type}' generated for {client['name']}",
    }


@router.get("/reports/download/{report_id}")
async def download_report(report_id: str):
    """Placeholder report download endpoint."""
    return {
        "report_id": report_id,
        "message": "PDF download would stream here in production (ReportLab or WeasyPrint).",
    }
