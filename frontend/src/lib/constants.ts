export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const DEFAULT_MODELS = {
  seo: "gemini",
  youtube: "gemini",
  tiktok: "gemini",
  ai_content: "gemini",
} as const;

export const TOOL_PATHS = {
  seo: "/api/seo",
  youtube: "/api/yt",
  tiktok: "/api/tt",
  aiContent: "/api/ai",
  settings: "/api/settings",
};
