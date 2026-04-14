from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class NicheRequest(BaseModel):
    content: str
    model_pref: str = "gemini"

class NicheResult(BaseModel):
    niche: str
    sub_niche: str
    estimated_rpm: str
    audience_type: str
    competition: str
    barrier_to_entry: str
    monetization_methods: List[str]
    top_creators: List[str]
    content_ideas: List[str]

class NicheResponse(BaseModel):
    niches: List[NicheResult]
    market_analysis: str
    profitability_index: str

@router.post("/niche-finder", response_model=NicheResponse)
async def find_niches(req: NicheRequest):
    # This is a basic mocked pipeline for now until further instructions.
    # In a real environment, it would use ai_orchestrator to ask OpenRouter.
    return {
        "niches": [
            {
                "niche": "Technology",
                "sub_niche": "AI Automation for Agencies",
                "estimated_rpm": "$25-$40",
                "audience_type": "B2B / Agency Owners",
                "competition": "Medium",
                "barrier_to_entry": "High knowledge & technical skills",
                "monetization_methods": ["Retainers", "Consulting", "Courses"],
                "top_creators": ["@AI_Agency_Owner"],
                "content_ideas": ["How to automate client onboarding", "Top 5 Make.com workflows for agencies"]
            },
            {
                "niche": "Finance",
                "sub_niche": "Micro-SaaS Acquisitions",
                "estimated_rpm": "$30-$50",
                "audience_type": "Investors / Founders",
                "competition": "Low",
                "barrier_to_entry": "Capital required & business acumen",
                "monetization_methods": ["Sponsorships", "Brokerage Fees", "Paid Newsletters"],
                "top_creators": ["@MicroAcquire_Guy"],
                "content_ideas": ["How I bought a $5k MRR SaaS", "What to look for in due diligence"]
            }
        ],
        "market_analysis": f"The market for {req.content} shows strong high-income potential. B2B variations exhibit the highest RPMs due to enterprise advertising spend.",
        "profitability_index": "9.2/10"
    }
