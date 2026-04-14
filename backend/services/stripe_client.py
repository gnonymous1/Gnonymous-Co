import stripe as stripe_sdk
from config import get_settings

settings = get_settings()

PLANS = {
    "free": {
        "name": "Free",
        "price_id": None,
        "price_usd": 0,
        "credits": 100,
        "features": [
            "5 tool runs/day",
            "Basic AI models",
            "7-day result history",
            "Core tools only",
            "Community support",
        ],
    },
    "pro": {
        "name": "Pro",
        "price_id": "price_pro_monthly",  # Replace with real Stripe Price ID
        "price_usd": 29,
        "credits": 5000,
        "features": [
            "Unlimited tool runs",
            "All AI models (Gemini / GPT-4o / NVIDIA)",
            "All 30+ modules unlocked",
            "Guided Mission workflows",
            "Autopilot agent chaining",
            "PDF / CSV export",
            "30-day result history",
            "Priority email support",
        ],
    },
    "agency": {
        "name": "Agency",
        "price_id": "price_agency_monthly",  # Replace with real Stripe Price ID
        "price_usd": 99,
        "credits": -1,  # Unlimited
        "features": [
            "Everything in Pro",
            "White-label branded reports",
            "10 client sub-workspaces",
            "Public API access (1000 req/day)",
            "Bulk operations (50 keywords)",
            "Custom domain support",
            "Dedicated account manager",
            "SLA guarantee",
        ],
    },
}


def get_stripe_client():
    stripe_sdk.api_key = settings.STRIPE_SECRET_KEY
    return stripe_sdk


async def create_checkout_session(
    plan: str, success_url: str, cancel_url: str, customer_email: str | None = None
) -> dict:
    plan_data = PLANS.get(plan)
    if not plan_data:
        raise ValueError(f"Unknown plan: {plan}")

    if plan_data["price_usd"] == 0:
        return {"url": success_url, "session_id": None}

    s = get_stripe_client()
    params: dict = {
        "mode": "subscription",
        "line_items": [{"price": plan_data["price_id"], "quantity": 1}],
        "success_url": success_url + "?session_id={CHECKOUT_SESSION_ID}",
        "cancel_url": cancel_url,
        "allow_promotion_codes": True,
        "trial_period_days": 14,
    }
    if customer_email:
        params["customer_email"] = customer_email

    session = s.checkout.Session.create(**params)
    return {"url": session.url, "session_id": session.id}


async def retrieve_subscription(subscription_id: str) -> dict:
    s = get_stripe_client()
    return s.Subscription.retrieve(subscription_id)


async def cancel_subscription(subscription_id: str) -> dict:
    s = get_stripe_client()
    return s.Subscription.cancel(subscription_id)
