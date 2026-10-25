import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, FilterMode, Theme, ViewMode } from "./types";
import type { CollectedAll, CollectedMap } from "./backup";
import { migrateState } from "./migrate";

interface State {
  category: Category;
  collected: Record<Category, CollectedMap>;
  theme: Theme;
  filter: FilterMode;
  query: string;
  selectedPrefs: string[];
  selectedCities: string[];
  filterOpen: boolean;
  selected: number | null;
  statsOpen: boolean;
  view: ViewMode;
  userPos: [number, number] | null;
  /** 現在地を追従中か */
  tracking: boolean;
  /** 画面下に一時表示するメッセージ（id は同じ文言の連続表示用） */
  toast: { id: number; msg: string } | null;
  setCategory: (c: Category) => void;
  toggleCollected: (no: number) => void;
  /** バックアップの取得済みを今のデータに追加する（既存のチェックは消さない） */
  mergeCollected: (incoming: CollectedAll) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setFilter: (f: FilterMode) => void;
  setQuery: (q: string) => void;
  togglePref: (pref: string) => void;
  toggleCity: (cityKey: string) => void;
  setSelectedPrefs: (prefs: string[]) => void;
  clearAdvancedFilters: () => void;
  setFilterOpen: (v: boolean) => void;
  select: (no: number | null) => void;
  setStatsOpen: (v: boolean) => void;
  setView: (v: ViewMode) => void;
  toggleView: () => void;
  setUserPos: (p: [number, number] | null) => void;
  setTracking: (v: boolean) => void;
  showToast: (msg: string) => void;
  hideToast: () => void;
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
      selectedPrefs: [],
      selectedCities: [],
      filterOpen: false,
      selected: null,
      statsOpen: false,
      view: "map",
      userPos: null,
      tracking: false,
      toast: null,
      setCategory: (category) =>
        set({ category, selected: null, query: "", selectedPrefs: [], selectedCities: [] }),
      toggleCollected: (no) =>
        set((s) => {
          const cur = { ...s.collected[s.category] };
          if (cur[no]) delete cur[no];
          else cur[no] = true;
          return { collected: { ...s.collected, [s.category]: cur } };
        }),
      mergeCollected: (incoming) =>
        set((s) => ({
          collected: {
            pokefuta: { ...s.collected.pokefuta, ...incoming.pokefuta },
            pokecen: { ...s.collected.pokecen, ...incoming.pokecen },
          },
        })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setFilter: (filter) => set({ filter }),
      setQuery: (query) => set({ query }),
      togglePref: (pref) =>
        set((s) => ({
          selectedPrefs: s.selectedPrefs.includes(pref)
            ? s.selectedPrefs.filter((p) => p !== pref)
            : [...s.selectedPrefs, pref],
        })),
      toggleCity: (cityKey) =>
        set((s) => ({
          selectedCities: s.selectedCities.includes(cityKey)
            ? s.selectedCities.filter((c) => c !== cityKey)
            : [...s.selectedCities, cityKey],
        })),
      setSelectedPrefs: (selectedPrefs) => set({ selectedPrefs, selectedCities: [] }),
      clearAdvancedFilters: () => set({ selectedPrefs: [], selectedCities: [] }),
      setFilterOpen: (filterOpen) => set({ filterOpen }),
      select: (selected) => set({ selected }),
      setStatsOpen: (statsOpen) => set({ statsOpen }),
      setView: (view) => set({ view }),
      toggleView: () => set({ view: get().view === "map" ? "list" : "map" }),
      setUserPos: (userPos) => set({ userPos }),
      showToast: (msg) => set({ toast: { id: Date.now(), msg } }),
      hideToast: () => set({ toast: null }),
      setTracking: (tracking) => set(tracking ? { tracking } : { tracking, userPos: null }),
    }),
    {
      name: "pokefuta_v1",
      version: 2,
      partialize: (s) => ({
        collected: s.collected,
        theme: s.theme,
        category: s.category,
      }),
      migrate: migrateState,
    }
  )
);
