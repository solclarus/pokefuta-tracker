import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, FilterMode, Theme, ViewMode } from "./types";

type CollectedMap = Record<number, true>;

interface State {
  category: Category;
  collected: Record<Category, CollectedMap>;
  theme: Theme;
  filter: FilterMode;
  query: string;
  selected: number | null;
  statsOpen: boolean;
  view: ViewMode;
  userPos: [number, number] | null;
  setCategory: (c: Category) => void;
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
      category: "pokefuta",
      collected: { pokefuta: {}, pokecen: {} },
      theme: systemTheme(),
      filter: "all",
      query: "",
      selected: null,
      statsOpen: false,
      view: "map",
      userPos: null,
      setCategory: (category) => set({ category, selected: null, query: "" }),
      toggleCollected: (no) =>
        set((s) => {
          const cur = { ...s.collected[s.category] };
          if (cur[no]) delete cur[no];
          else cur[no] = true;
          return { collected: { ...s.collected, [s.category]: cur } };
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
      version: 2,
      partialize: (s) => ({
        collected: s.collected,
        theme: s.theme,
        category: s.category,
      }),
      migrate: (persisted, version) => {
        const p = persisted as { collected?: Record<string, unknown> } | undefined;
        if (p && version < 2) {
          const old = p.collected ?? {};
          const isFlat = !("pokefuta" in old) && !("pokecen" in old);
          p.collected = {
            pokefuta: (isFlat ? old : (old as Record<string, CollectedMap>).pokefuta) ?? {},
            pokecen: (old as Record<string, CollectedMap>).pokecen ?? {},
          };
        }
        return p as unknown;
      },
    }
  )
);
