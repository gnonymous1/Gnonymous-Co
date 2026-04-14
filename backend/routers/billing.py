from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from services.stripe_client import create_checkout_session, PLANS, get_stripe_client
from config import get_settings
import json

router = APIRouter()
settings = get_settings()


class CheckoutRequest(BaseModel):
    plan: str
    email: str | None = None
    success_url: str = "http://localhost:3000/billing"
    cancel_url: str = "http://localhost:3000/pricing"


@router.get("/plans")
async def get_plans():
    """Return all plan details for the pricing page."""
    return {"plans": PLANS}


@router.post("/create-checkout")
async def create_checkout(req: CheckoutRequest):
    """Create a Stripe Checkout session and return the redirect URL."""
    if req.plan not in PLANS:
        raise HTTPException(status_code=400, detail=f"Invalid plan: {req.plan}")
    try:
        result = await create_checkout_session(
            plan=req.plan,
            success_url=req.success_url,
            cancel_url=req.cancel_url,
            customer_email=req.email,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks for subscription events."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        s = get_stripe_client()
        if settings.STRIPE_WEBHOOK_SECRET:
            event = s.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        else:
            event = json.loads(payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid payload: {e}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook error: {e}")

    event_type = event.get("type", "")

    if event_type == "checkout.session.completed":
        session = event["data"]["object"]
        customer_email = session.get("customer_email", "unknown")
        plan_id = session.get("metadata", {}).get("plan", "pro")
        # TODO: Upsert user plan in database
        print(f"[Billing] Checkout completed for {customer_email}, plan={plan_id}")

    elif event_type == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        customer_id = subscription.get("customer")
        # TODO: Downgrade user to free tier in database
        print(f"[Billing] Subscription cancelled for customer={customer_id}")

    elif event_type == "invoice.payment_failed":
        invoice = event["data"]["object"]
        # TODO: Send dunning email
        print(f"[Billing] Payment failed for invoice={invoice.get('id')}")

    return {"status": "ok", "event": event_type}


@router.get("/status")
async def billing_status():
    """Return current user's billing status (mock — replace with JWT lookup)."""
    return {
        "plan": "free",
        "credits_used": 47,
        "credits_total": 100,
        "credits_pct": 47,
        "next_billing_date": None,
        "subscription_id": None,
        "features": PLANS["free"]["features"],
    }
