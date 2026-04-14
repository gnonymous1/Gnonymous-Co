import asyncio
import json
import random
import logging
import time
from typing import Dict, Any, List, Optional, Tuple
from collections import defaultdict
from enum import Enum
from sqlalchemy.ext.asyncio import AsyncSession
from models.models import UsageLog
from database import AsyncSessionLocal

logger = logging.getLogger(__name__)

# ─── Model Configuration ────────────────────────────────────────────────────
# Tiered model pool with performance characteristics
MODEL_TIERS = {
    "premium": [
        ("google/gemma-4-31b-it:free", {"speed": 9, "quality": 9, "cost": 8}),
        ("nvidia/nemotron-3-super-120b-a12b:free", {"speed": 8, "quality": 10, "cost": 9}),
        ("meta-llama/llama-4-scout:free", {"speed": 8, "quality": 9, "cost": 7}),
        ("mistralai/mistral-large:free", {"speed": 8, "quality": 9, "cost": 7}),
        ("huggingfaceh4/zephyr-7b-beta:free", {"speed": 7, "quality": 8, "cost": 6}),
    ],
    "standard": [
        ("z-ai/glm-4.5-air:free", {"speed": 7, "quality": 8, "cost": 6}),
        ("minimax/minimax-m2.5:free", {"speed": 7, "quality": 7, "cost": 5}),
        ("deepseek/deepseek-r1-0528:free", {"speed": 6, "quality": 8, "cost": 5}),
        ("codestral/codestral-latest:free", {"speed": 7, "quality": 8, "cost": 5}),
        ("mistralai/mistral-small:free", {"speed": 8, "quality": 7, "cost": 4}),
    ],
    "fast": [
        ("microsoft/phi-4-reasoning:free", {"speed": 10, "quality": 6, "cost": 4}),
        ("huggingfaceh4/zephyr-7b-beta:free", {"speed": 9, "quality": 7, "cost": 3}),
        ("mistralai/mistral-tiny:free", {"speed": 10, "quality": 6, "cost": 3}),
    ]
}

# Circuit Breaker States
class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

# Enhanced performance tracking and failure management
_model_stats = defaultdict(lambda: {
    "success": 0,
    "failures": 0,
    "last_used": 0,
    "last_failure": 0,
    "circuit_state": CircuitState.CLOSED,
    "failure_count": 0,
    "last_state_change": 0
})

_failed_models = set()
_cooldown_period = 300  # 5 minutes cooldown for failed models

# Circuit Breaker Configuration
CIRCUIT_BREAKER_CONFIG = {
    "failure_threshold": 3,      # Number of failures to trip circuit
    "reset_timeout": 60,          # Seconds before attempting reset
    "half_open_max_attempts": 2,  # Attempts allowed in half-open state
    "success_threshold": 2       # Successes needed to close circuit
}

def _get_model_score(model_id: str) -> float:
    """Calculate performance score for model selection"""
    stats = _model_stats[model_id]
    base_score = 10.0

    # Apply penalties for recent failures
    if model_id in _failed_models:
        time_since_failure = time.time() - stats["last_failure"]
        if time_since_failure < _cooldown_period:
            penalty = 0.8 - (0.4 * (time_since_failure / _cooldown_period))
            base_score *= max(0.2, penalty)

    # Boost for recent successes
    success_rate = stats["success"] / max(1, stats["success"] + stats["failures"])
    base_score *= min(1.2, 1.0 + (success_rate * 0.2))

    # Penalty for open circuit breakers
    if stats["circuit_state"] == CircuitState.OPEN:
        base_score *= 0.1  # Strong penalty for open circuits

    return base_score

def _check_circuit_breaker(model_id: str) -> bool:
    """Check if circuit breaker allows requests for this model"""
    stats = _model_stats[model_id]

    # If circuit is open, check if we should transition to half-open
    if stats["circuit_state"] == CircuitState.OPEN:
        time_since_failure = time.time() - stats["last_state_change"]
        if time_since_failure >= CIRCUIT_BREAKER_CONFIG["reset_timeout"]:
            logger.info(f"[Circuit] {model_id} transitioning from OPEN to HALF_OPEN")
            stats["circuit_state"] = CircuitState.HALF_OPEN
            stats["failure_count"] = 0
            stats["last_state_change"] = time.time()
            return True
        return False

    # If circuit is half-open, check attempt limit
    elif stats["circuit_state"] == CircuitState.HALF_OPEN:
        if stats["failure_count"] >= CIRCUIT_BREAKER_CONFIG["half_open_max_attempts"]:
            logger.warning(f"[Circuit] {model_id} half-open attempts exhausted, reopening circuit")
            stats["circuit_state"] = CircuitState.OPEN
            stats["last_state_change"] = time.time()
            return False
        return True

    # Circuit is closed, allow requests
    return True

def _update_circuit_state(model_id: str, success: bool):
    """Update circuit breaker state based on request outcome"""
    stats = _model_stats[model_id]

    if success:
        if stats["circuit_state"] == CircuitState.HALF_OPEN:
            stats["success_count"] = stats.get("success_count", 0) + 1
            if stats["success_count"] >= CIRCUIT_BREAKER_CONFIG["success_threshold"]:
                logger.info(f"[Circuit] {model_id} recovered, closing circuit")
                stats["circuit_state"] = CircuitState.CLOSED
                stats["failure_count"] = 0
                stats["success_count"] = 0
        # Reset failure count on success
        stats["failure_count"] = 0
    else:
        stats["failure_count"] += 1
        if stats["circuit_state"] == CircuitState.CLOSED and \
           stats["failure_count"] >= CIRCUIT_BREAKER_CONFIG["failure_threshold"]:
            logger.warning(f"[Circuit] {model_id} circuit breaker tripped (OPEN)")
            stats["circuit_state"] = CircuitState.OPEN
            stats["last_state_change"] = time.time()
            _failed_models.add(model_id)

def _select_optimal_model(tool_type: str, exclude: Optional[str] = None) -> Tuple[str, str]:
    """
    Intelligent model selection based on tool requirements and performance history.
    Returns (model_id, tier)
    """
    # Determine tier based on tool type
    if tool_type in ["seo", "content_analysis", "strategic_planning"]:
        target_tier = "premium"  # High quality needed
    elif tool_type in ["quick_generation", "simple_analysis", "data_extraction"]:
        target_tier = "fast"     # Speed prioritized
    else:
        target_tier = "standard" # Balanced approach

    # Get available models from target tier and higher
    candidates = []
    for tier in ["premium", "standard", "fast"]:
        if tier == target_tier or tier == "premium":  # Always include premium as fallback
            for model_id, _ in MODEL_TIERS[tier]:
                if (model_id != exclude and
                    model_id not in _failed_models and
                    _check_circuit_breaker(model_id)):
                    candidates.append(model_id)

    if not candidates:
        # Reset failed models if all are unavailable
        _failed_models.clear()
        candidates = [model_id for model_id, _ in sum(MODEL_TIERS.values(), []) if model_id != exclude]

    # Score and select best candidate
    scored = [(model, _get_model_score(model)) for model in candidates]
    scored.sort(key=lambda x: x[1], reverse=True)

    selected = scored[0][0]
    logger.info(f"[Model Select] Tool: {tool_type}, Tier: {target_tier}, Selected: {selected}, Circuit: {_model_stats[selected]['circuit_state'].value}")
    return selected, target_tier

class AIOrchestrator:
    """
    Enhanced AI dispatcher with:
    - Intelligent model selection based on task requirements
    - Performance-based model scoring and rotation
    - Circuit breaker pattern for fault tolerance
    - Comprehensive error handling and fallback mechanisms
    - Usage tracking and cost optimization
    """

    def __init__(self, api_keys: Dict[str, str]):
        self.api_keys = api_keys
        self.usage_stats = defaultdict(lambda: {"tokens": 0, "cost": 0.0, "calls": 0, "errors": 0})
        self.request_metrics = defaultdict(lambda: {"latency": [], "timestamp": time.time()})

    # ── Gemini ────────────────────────────────────────────────────────────────
    async def _gemini_call(self, prompt: str, system_prompt: str) -> str:
        key = self.api_keys.get("gemini", "")
        if not key:
            raise ValueError("Gemini API key not configured")

        import google.generativeai as genai
        genai.configure(api_key=key)

        start_time = time.time()
        try:
            model = genai.GenerativeModel(
                model_name="gemini-2.0-flash",
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "max_output_tokens": 8192,
                    "response_mime_type": "application/json",
                },
                system_instruction=system_prompt,
            )
            response = await asyncio.to_thread(model.generate_content, prompt)

            # Track latency
            latency = time.time() - start_time
            self.request_metrics["gemini"]["latency"].append(latency)
            self.request_metrics["gemini"]["timestamp"] = time.time()

            return response.text
        except Exception as e:
            self.usage_stats["gemini"]["errors"] += 1
            raise

    # ── OpenRouter (intelligent rotation with circuit breakers) ────────────────────
    async def _openrouter_call(
        self,
        prompt: str,
        system_prompt: str,
        model: Optional[str] = None,
        tool_type: str = "standard",
        *,
        retries: int = 3,
    ) -> str:
        key = self.api_keys.get("openrouter", "")
        if not key:
            raise ValueError("OpenRouter API key not configured")

        import aiohttp

        # Select optimal model if none provided
        chosen, tier = _select_optimal_model(tool_type) if model is None else (model, "manual")
        last_err = None
        start_time = time.time()

        for attempt in range(retries):
            try:
                # Check circuit breaker before attempting
                if not _check_circuit_breaker(chosen):
                    logger.warning(f"[OR] {chosen} circuit breaker is OPEN, skipping")
                    chosen, _ = _select_optimal_model(tool_type, exclude=chosen)
                    continue

                payload: Dict[str, Any] = {
                    "model": chosen,
                    "messages": [
                        {"role": "system", "content": system_prompt + "\nRespond ONLY in valid JSON."},
                        {"role": "user",   "content": prompt},
                    ],
                    "temperature": 0.7,
                    "max_tokens": 8192,
                }

                headers = {
                    "Authorization": f"Bearer {key}",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Apex Content OS v7",
                }

                async with aiohttp.ClientSession() as session:
                    try:
                        async with session.post(
                            "https://openrouter.ai/api/v1/chat/completions",
                            json=payload,
                            headers=headers,
                            timeout=aiohttp.ClientTimeout(total=60),
                        ) as resp:
                            if resp.status == 429:
                                # Rate limited — try next model
                                logger.warning(f"[OR] {chosen} rate-limited, rotating...")
                                _failed_models.add(chosen)
                                _model_stats[chosen]["last_failure"] = time.time()
                                _update_circuit_state(chosen, False)
                                chosen, _ = _select_optimal_model(tool_type, exclude=chosen)
                                await asyncio.sleep(1 + attempt * 0.5)  # Exponential backoff
                                continue

                            if resp.status in (404, 400):
                                # Model not found or unavailable — rotate
                                body = await resp.text()
                                logger.warning(f"[OR] {chosen} returned {resp.status}: {body[:200]}")
                                _failed_models.add(chosen)
                                _model_stats[chosen]["last_failure"] = time.time()
                                _update_circuit_state(chosen, False)
                                chosen, _ = _select_optimal_model(tool_type, exclude=chosen)
                                continue

                            resp.raise_for_status()
                            data = await resp.json()

                            # Track success
                            _failed_models.discard(chosen)
                            _model_stats[chosen]["success"] += 1
                            _model_stats[chosen]["last_used"] = time.time()
                            _update_circuit_state(chosen, True)

                            # Track latency metrics
                            latency = time.time() - start_time
                            self.request_metrics[chosen]["latency"].append(latency)
                            self.request_metrics[chosen]["timestamp"] = time.time()

                            content = data["choices"][0]["message"]["content"]
                            logger.info(f"[OR] Success with model: {chosen} (Tier: {tier}, Latency: {latency:.2f}s)")
                            return content

                    except asyncio.TimeoutError:
                        logger.warning(f"[OR] {chosen} request timed out")
                        _update_circuit_state(chosen, False)
                        chosen, _ = _select_optimal_model(tool_type, exclude=chosen)
                        await asyncio.sleep(0.5 * (attempt + 1))
                        continue

            except aiohttp.ClientResponseError as e:
                last_err = e
                logger.warning(f"[OR] Attempt {attempt+1} failed ({chosen}): {e}")
                _failed_models.add(chosen)
                _model_stats[chosen]["failures"] += 1
                _model_stats[chosen]["last_failure"] = time.time()
                _update_circuit_state(chosen, False)
                chosen, _ = _select_optimal_model(tool_type, exclude=chosen)
                await asyncio.sleep(0.5 * (attempt + 1))

            except Exception as e:
                last_err = e
                logger.warning(f"[OR] Unexpected error ({chosen}): {e}")
                _failed_models.add(chosen)
                _model_stats[chosen]["failures"] += 1
                _model_stats[chosen]["last_failure"] = time.time()
                _update_circuit_state(chosen, False)
                chosen, _ = _select_optimal_model(tool_type, exclude=chosen)
                await asyncio.sleep(0.5)

        raise RuntimeError(f"All OpenRouter models failed after {retries} attempts. Last: {last_err}")

    # ── Mistral AI ────────────────────────────────────────────────────────────
    async def _mistral_call(self, prompt: str, system_prompt: str) -> str:
        key = self.api_keys.get("mistral", "")
        if not key:
            raise ValueError("Mistral API key not configured")

        import aiohttp

        start_time = time.time()
        try:
            payload = {
                "model": "mistral-large-latest",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.7,
                "max_tokens": 8192,
                "response_format": {"type": "json_object"},
            }

            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            }

            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://api.mistral.ai/v1/chat/completions",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=60),
                ) as resp:
                    resp.raise_for_status()
                    data = await resp.json()

                    # Track latency
                    latency = time.time() - start_time
                    self.request_metrics["mistral"]["latency"].append(latency)
                    self.request_metrics["mistral"]["timestamp"] = time.time()

                    return data["choices"][0]["message"]["content"]

        except Exception as e:
            self.usage_stats["mistral"]["errors"] += 1
            raise

    # ── Hugging Face ─────────────────────────────────────────────────────────
    async def _huggingface_call(self, prompt: str, system_prompt: str) -> str:
        key = self.api_keys.get("huggingface", "")
        if not key:
            raise ValueError("Hugging Face API key not configured")

        import aiohttp

        start_time = time.time()
        try:
            payload = {
                "inputs": f"{system_prompt}\n\n{prompt}",
                "parameters": {
                    "temperature": 0.7,
                    "max_new_tokens": 4096,
                    "return_full_text": False,
                },
                "options": {
                    "use_cache": False,
                    "wait_for_model": True,
                },
            }

            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            }

            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=120),
                ) as resp:
                    resp.raise_for_status()
                    data = await resp.json()

                    # Track latency
                    latency = time.time() - start_time
                    self.request_metrics["huggingface"]["latency"].append(latency)
                    self.request_metrics["huggingface"]["timestamp"] = time.time()

                    # Extract generated text from response
                    if isinstance(data, list) and len(data) > 0:
                        return data[0]["generated_text"]
                    elif isinstance(data, dict) and "generated_text" in data:
                        return data["generated_text"]
                    else:
                        return str(data)

        except Exception as e:
            self.usage_stats["huggingface"]["errors"] += 1
            raise

    # ── Codestral ────────────────────────────────────────────────────────────
    async def _codestral_call(self, prompt: str, system_prompt: str) -> str:
        key = self.api_keys.get("codestral", "")
        if not key:
            raise ValueError("Codestral API key not configured")

        import aiohttp

        start_time = time.time()
        try:
            payload = {
                "model": "codestral-latest",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.7,
                "max_tokens": 8192,
                "response_format": {"type": "json_object"},
            }

            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            }

            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://api.codestral.ai/v1/chat/completions",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=60),
                ) as resp:
                    resp.raise_for_status()
                    data = await resp.json()

                    # Track latency
                    latency = time.time() - start_time
                    self.request_metrics["codestral"]["latency"].append(latency)
                    self.request_metrics["codestral"]["timestamp"] = time.time()

                    return data["choices"][0]["message"]["content"]

        except Exception as e:
            self.usage_stats["codestral"]["errors"] += 1
            raise

    # ── Main dispatch ─────────────────────────────────────────────────────────
    async def process(
        self,
        tool_id: str,
        prompt: str,
        model_pref: str,
        system_prompt: str,
        model: Optional[str] = None,
        tool_type: str = "standard",
    ) -> Dict[str, Any]:
        """
        Route to the correct AI provider and return parsed JSON data.
        Called ONLY when the user explicitly triggers a generation request.
        """
        chosen_model = "unknown"
        start_time = time.time()

        try:
            raw_text = ""

            if model_pref == "gemini":
                raw_text = await self._gemini_call(prompt, system_prompt)
                chosen_model = "gemini-2.0-flash"

            elif model_pref == "openrouter":
                # Use provided model or auto-select based on tool type
                target = model or None
                raw_text = await self._openrouter_call(prompt, system_prompt, model=target, tool_type=tool_type)
                chosen_model = target if target else _select_optimal_model(tool_type)[0]

            elif model_pref == "mistral":
                raw_text = await self._mistral_call(prompt, system_prompt)
                chosen_model = "mistral-large-latest"

            elif model_pref == "huggingface":
                raw_text = await self._huggingface_call(prompt, system_prompt)
                chosen_model = "zephyr-7b-beta"

            elif model_pref == "codestral":
                raw_text = await self._codestral_call(prompt, system_prompt)
                chosen_model = "codestral-latest"

            else:
                return {"error": f"Unsupported provider: {model_pref}"}

            # Strip markdown code blocks if present
            cleaned = raw_text.strip()
            if cleaned.startswith("```"):
                lines = cleaned.split("\n")
                cleaned = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])
            cleaned = cleaned.strip()

            parsed = json.loads(cleaned)

            # Track usage statistics
            processing_time = time.time() - start_time
            tokens_est = len(prompt.split()) * 4
            cost_est = 0.001
            
            await self._log_to_db(tool_id, chosen_model, tokens_est, cost_est)

            return {
                "data": parsed,
                "model_used": chosen_model,
                "provider": model_pref,
                "stats": {
                    "processing_time": processing_time,
                    "estimated_tokens": tokens_est,
                    "estimated_cost": cost_est,
                    "circuit_status": _model_stats.get(chosen_model, {}).get("circuit_state", CircuitState.CLOSED).value
                }
            }

        except json.JSONDecodeError as e:
            # Return raw text so the caller can handle it
            logger.error(f"[{tool_id}] JSON parse error: {e} | Raw: {raw_text[:300]}")
            self.usage_stats[tool_id]["errors"] += 1
            return {"error": f"JSON parse error: {e}", "raw": raw_text[:500]}

        except Exception as e:
            logger.error(f"[{tool_id}] AI call failed: {e}")
            self.usage_stats[tool_id]["errors"] += 1
            return {"error": str(e)}

    async def _log_to_db(self, tool_id: str, model: str, tokens: int, cost: float):
        """Helper to log usage to SQLite."""
        try:
            async with AsyncSessionLocal() as db:
                log = UsageLog(
                    tool_id=tool_id,
                    model_used=model,
                    tokens_input=tokens // 2, # Rough split
                    tokens_output=tokens // 2,
                    cost_usd=cost
                )
                db.add(log)
                await db.commit()
        except Exception as e:
            logger.error(f"[Orchestrator] Failed to log usage to DB: {e}")

    # ── Enhanced Error Handling ──────────────────────────────────────────────
    async def process_with_fallback(
        self,
        tool_id: str,
        prompt: str,
        model_pref: str,
        system_prompt: str,
        model: Optional[str] = None,
        tool_type: str = "standard",
    ) -> Dict[str, Any]:
        """
        Enhanced process method with automatic fallback between providers
        """
        # Try primary provider
        result = await self.process(tool_id, prompt, model_pref, system_prompt, model, tool_type)

        # If primary fails and we have alternative providers, try fallback
        if "error" in result and model_pref == "openrouter":
            logger.warning(f"[{tool_id}] Primary provider failed, attempting Gemini fallback")
            fallback_result = await self.process(tool_id, prompt, "gemini", system_prompt, tool_type=tool_type)
            if "data" in fallback_result:
                fallback_result["fallback_used"] = True
                fallback_result["original_error"] = result["error"]
                return fallback_result

        return result

    # ── Performance Analytics ────────────────────────────────────────────────
    def get_performance_report(self) -> Dict[str, Any]:
        """Get comprehensive performance analytics"""
        return {
            "model_stats": dict(_model_stats),
            "failed_models": list(_failed_models),
            "usage_stats": dict(self.usage_stats),
            "request_metrics": dict(self.request_metrics),
            "cooldown_status": {
                model: {
                    "time_since_failure": time.time() - stats["last_failure"],
                    "ready_in": max(0, _cooldown_period - (time.time() - stats["last_failure"])),
                    "circuit_state": stats["circuit_state"].value
                }
                for model, stats in _model_stats.items()
                if model in _failed_models
            },
            "circuit_breaker_summary": {
                model: {
                    "state": stats["circuit_state"].value,
                    "failure_count": stats["failure_count"],
                    "time_in_state": time.time() - stats["last_state_change"]
                }
                for model, stats in _model_stats.items()
            }
        }

    # ── Health Check ────────────────────────────────────────────────────────
    def get_health_status(self) -> Dict[str, Any]:
        """Get system health status"""
        healthy_models = []
        degraded_models = []
        failed_models = []

        for model_id, stats in _model_stats.items():
            if stats["circuit_state"] == CircuitState.CLOSED:
                healthy_models.append(model_id)
            elif stats["circuit_state"] == CircuitState.HALF_OPEN:
                degraded_models.append(model_id)
            else:
                failed_models.append(model_id)

        return {
            "status": "healthy" if healthy_models else "degraded" if degraded_models else "unhealthy",
            "healthy_models": healthy_models,
            "degraded_models": degraded_models,
            "failed_models": failed_models,
            "timestamp": time.time()
        }

    # ── Streaming placeholder ─────────────────────────────────────────────────
    async def stream_process(self, prompt: str, queue: asyncio.Queue):
        """Phase 3 — SSE streaming via asyncio.Queue."""
        pass