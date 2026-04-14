export type ApiKeys = {
  gemini: string;
  openrouter: string;
  nvidia: string;
  serper: string;
  youtube: string;
};

export type ModelPreferences = {
  seo: "gemini" | "openrouter" | "nvidia";
  youtube: "gemini" | "openrouter" | "nvidia";
  tiktok: "gemini" | "openrouter" | "nvidia";
  ai_content: "gemini" | "openrouter" | "nvidia";
};

export type UsageData = {
  totalTokens: number;
  totalCost: number;
  callsByModel: Record<string, number>;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  ownerId?: string;
  createdAt: string;
  updatedAt?: string;
};

export type GlobalUIState = {
  sidebarCollapsed: boolean;
  activeTool: string;
  theme: "dark" | "light";
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  error?: string;
};
