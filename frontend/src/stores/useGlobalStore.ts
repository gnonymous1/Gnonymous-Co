import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ApiKeys {
  gemini: string;
  openrouter: string;
  nvidia: string;
  mistral: string;
  huggingface: string;
  codestral: string;
  serper: string;
  youtube: string;
}

interface ModelPreferences {
  seo: "gemini" | "openrouter" | "nvidia" | "mistral" | "huggingface" | "codestral";
  youtube: "gemini" | "openrouter" | "nvidia" | "mistral" | "huggingface" | "codestral";
  tiktok: "gemini" | "openrouter" | "nvidia" | "mistral" | "huggingface" | "codestral";
  ai_content: "gemini" | "openrouter" | "nvidia" | "mistral" | "huggingface" | "codestral";
  openRouterModel: string;
}

interface UsageData {
  totalTokens: number;
  totalCost: number;
  callsByModel: Record<string, number>;
}

interface GlobalState {
  // API Keys
  apiKeys: ApiKeys;
  setApiKey: (provider: keyof ApiKeys, key: string) => void;
  setApiKeys: (keys: Partial<ApiKeys>) => void;

  // Model Preferences
  modelPreferences: ModelPreferences;
      setModelPreference: (
        category: keyof Omit<ModelPreferences, "openRouterModel">,
        model: "gemini" | "openrouter" | "nvidia" | "mistral" | "huggingface" | "codestral"
      ) => void;
  setOpenRouterModel: (model: string) => void;

  // Usage
  usage: UsageData;
  addUsage: (model: string, tokens: number, cost: number) => void;

  // UI
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      // API Keys
      apiKeys: {
        gemini: "",
        openrouter: "",
        nvidia: "",
        mistral: "",
        huggingface: "",
        codestral: "",
        serper: "",
        youtube: "",
      },
      setApiKey: (provider, key) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: key },
        })),
      setApiKeys: (keys) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, ...keys },
        })),

      // Model Preferences
      modelPreferences: {
        seo: "gemini",
        youtube: "gemini",
        tiktok: "gemini",
        ai_content: "gemini",
        openRouterModel: "qwen/qwen-2.5-72b-instruct:free",
      },
      setModelPreference: (category, model) =>
        set((state) => ({
          modelPreferences: { ...state.modelPreferences, [category]: model },
        })),
      setOpenRouterModel: (model) =>
        set((state) => ({
          modelPreferences: { ...state.modelPreferences, openRouterModel: model },
        })),

      // Usage
      usage: { totalTokens: 0, totalCost: 0, callsByModel: {} },
      addUsage: (model, tokens, cost) =>
        set((state) => ({
          usage: {
            totalTokens: state.usage.totalTokens + tokens,
            totalCost: state.usage.totalCost + cost,
            callsByModel: {
              ...state.usage.callsByModel,
              [model]: (state.usage.callsByModel[model] || 0) + 1,
            },
          },
        })),

      // UI
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      activeTool: "",
      setActiveTool: (tool) => set({ activeTool: tool }),
    }),
    {
      name: "apex-content-os-storage",
      partialize: (state) => ({
        apiKeys: state.apiKeys,
        modelPreferences: state.modelPreferences,
        usage: state.usage,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
