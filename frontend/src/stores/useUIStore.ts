import { create } from "zustand";
import type { GlobalUIState } from "@/types";

interface UIStore extends GlobalUIState {
  setTheme: (theme: "dark" | "light") => void;
  toggleSidebar: () => void;
  setActiveTool: (tool: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: "dark",
  sidebarCollapsed: false,
  activeTool: "",
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActiveTool: (tool) => set({ activeTool: tool }),
}));
