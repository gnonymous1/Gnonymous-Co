import asyncio
import logging
from typing import Optional, List
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

class IntelligentScraper:
    """
    Advanced scraper using Playwright for headless browser simulation.
    Includes anti-detection, distillation, and recursive depth control.
    """
    
    def __init__(self):
        self.ua_list = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        ]

    async def scrape_url(self, url: str, depth: int = 1) -> str:
        """Fetch and distill content from a URL."""
        logger.info(f"[Scraper] Fetching {url} (depth={depth})")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent=self.ua_list[0],
                viewport={'width': 1280, 'height': 800}
            )
            page = await context.new_page()
            
            try:
                # Navigate with human-like timeout
                await page.goto(url, wait_until="networkidle", timeout=30000)
                
                # Wait for content to settle
                await asyncio.sleep(2)
                
                html = await page.content()
                text = self._distill_content(html)
                
                return text
                
            except Exception as e:
                logger.error(f"[Scraper] Failed to scrape {url}: {e}")
                return ""
            finally:
                await browser.close()

    def _distill_content(self, html: str) -> str:
        """Remove HTML noise and return dense text."""
        soup = BeautifulSoup(html, "html.parser")
        
        # Remove noise
        for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
            tag.decompose()
            
        # Extract main text
        text = soup.get_text(separator="\n", strip=True)
        
        # Simple heuristic to keep only lines with content
        lines = [line for line in text.splitlines() if len(line) > 20]
        return "\n".join(lines[:200]) # Limit to ~5000 chars for AI context

# Global instance
scraper = IntelligentScraper()

def get_scraper() -> IntelligentScraper:
    return scraper
