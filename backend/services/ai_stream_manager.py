import json
import asyncio
import logging
from typing import AsyncGenerator, Dict, Any, List, Optional
from fastapi.responses import StreamingResponse
from services.ai_orchestrator import AIOrchestrator, CircuitState

logger = logging.getLogger(__name__)

class AIStreamManager:
    """
    Handles Server-Sent Events (SSE) streaming with multi-model fallback.
    """
    
    def __init__(self, api_keys: Dict[str, str]):
        self.orchestrator = AIOrchestrator(api_keys)
        self.fallback_chain = ["gemini", "openrouter"]

    async def stream_generate(
        self, 
        tool_id: str, 
        prompt: str, 
        system_prompt: str, 
        model_pref: str = "gemini"
    ) -> AsyncGenerator[str, None]:
        """
        Generates an SSE stream with automatic fallback logic.
        """
        
        # Determine sequence: pref model first, then fallbacks
        providers = [model_pref] + [p for p in self.fallback_chain if p != model_pref]
        
        last_error = None
        for provider in providers:
            try:
                logger.info(f"[AIStream] Attempting generation with {provider} for {tool_id}")
                
                # In a real implementation, the provider's specific client would support streaming.
                # For now, we simulate the stream from the orchestrator's response 
                # or call a streaming method if available.
                
                # Mock streaming behavior for the bridge
                if provider == "gemini":
                    # Full response for now, yielding as one big 'chunk' to simulate stream
                    result = await self.orchestrator.process(tool_id, prompt, provider, system_prompt)
                    if "error" in result:
                        raise Exception(result["error"])
                    
                    data = result.get("data", {})
                    yield f"data: {json.dumps({'type': 'content', 'data': data, 'model': provider})}\n\n"
                    return # Success

                elif provider == "openrouter":
                    result = await self.orchestrator.process(tool_id, prompt, provider, system_prompt)
                    if "error" in result:
                        raise Exception(result["error"])
                    
                    data = result.get("data", {})
                    yield f"data: {json.dumps({'type': 'content', 'data': data, 'model': provider})}\n\n"
                    return # Success

            except Exception as e:
                last_error = str(e)
                logger.warning(f"[AIStream] Provider {provider} failed: {e}")
                yield f"data: {json.dumps({'type': 'fallback', 'failed_provider': provider, 'error': str(e)})}\n\n"
                continue

        yield f"data: {json.dumps({'type': 'error', 'message': f'All providers failed. Last error: {last_error}'})}\n\n"

def get_stream_manager(api_keys: Dict[str, str]) -> AIStreamManager:
    return AIStreamManager(api_keys)
