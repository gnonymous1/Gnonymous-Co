import sys
from pathlib import Path
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import pytest
from routers import settings as settings_router
from routers import seo as seo_router


@pytest.fixture(autouse=True)
def reset_router_state():
    settings_router._model_prefs.clear()
    settings_router._model_prefs.update(
        {
            "seo": "gemini",
            "youtube": "gemini",
            "tiktok": "gemini",
            "ai_content": "gemini",
        }
    )
    seo_router._api_keys.clear()
    settings_router._workspace_users[:] = [
        {
            "id": str(uuid.uuid4()),
            "name": "You (Owner)",
            "email": "owner@apex.local",
            "role": "admin",
            "created_at": datetime.utcnow().isoformat(),
        }
    ]
    settings_router._usage_logs.clear()
    settings_router._archives.clear()
