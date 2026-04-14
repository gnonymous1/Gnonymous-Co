import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "@/types";

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  setActiveProject: (projectId: string | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      activeProjectId: null,
      setProjects: (projects) => set({ projects }),
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      setActiveProject: (projectId) => set({ activeProjectId: projectId }),
    }),
    {
      name: "apex-project-store",
      partialize: (state) => ({ projects: state.projects, activeProjectId: state.activeProjectId }),
    }
  )
);
