import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FilterMode, Theme, ViewMode } from "./types";

interface State {
  collected: Record<number, true>;
  theme: Theme;
  filter: FilterMode;
  query: string;
  selected: number | null;
  statsOpen: boolean;
  view: ViewMode;
  userPos: [number, number] | null;
  toggleCollected: (no: number) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setFilter: (f: FilterMode) => void;
  setQuery: (q: string) => void;
  select: (no: number | null) => void;
  setStatsOpen: (v: boolean) => void;
  setView: (v: ViewMode) => void;
  toggleView: () => void;
  setUserPos: (p: [number, number] | null) => void;
}

const systemTheme = (): Theme =>
  window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      collected: {},
      theme: systemTheme(),
      filter: "all",
      query: "",
      selected: null,
      statsOpen: false,
      view: "map",
      userPos: null,
      toggleCollected: (no) =>
        set((s) => {
          const next = { ...s.collected };
          if (next[no]) delete next[no];
          else next[no] = true;
          return { collected: next };
        }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setFilter: (filter) => set({ filter }),
      setQuery: (query) => set({ query }),
      select: (selected) => set({ selected }),
      setStatsOpen: (statsOpen) => set({ statsOpen }),
      setView: (view) => set({ view }),
      toggleView: () => set({ view: get().view === "map" ? "list" : "map" }),
      setUserPos: (userPos) => set({ userPos }),
    }),
    {
      name: "pokefuta_v1",
      partialize: (s) => ({ collected: s.collected, theme: s.theme }),
    }
  )
);
