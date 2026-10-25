import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, CollectedAll, FilterMode, Theme, ViewMode } from "./types";
import type { LatLng } from "./lib/geo";
import { cityKey } from "./lib/filter";
import { migrateState } from "./lib/migrate";

interface State {
  // 端末に保存する状態
  category: Category;
  collected: CollectedAll;
  theme: Theme;

  // 絞り込み
  filter: FilterMode;
  query: string;
  selectedPrefs: string[];
  /** cityKey(pref, city) の配列 */
  selectedCities: string[];

  // 画面
  view: ViewMode;
  selected: number | null;
  statsOpen: boolean;
  filterOpen: boolean;
  /** 画面下に一時表示するメッセージ（id は同じ文言の連続表示用） */
  toast: { id: number; msg: string } | null;

  // 現在地
  /** 現在地を追従中か */
  tracking: boolean;
  userPos: LatLng | null;

  setCategory: (c: Category) => void;
  toggleCollected: (no: number) => void;
  /** バックアップの取得済みを今のデータに追加する（既存のチェックは消さない） */
  mergeCollected: (incoming: CollectedAll) => void;
  toggleTheme: () => void;

  setFilter: (f: FilterMode) => void;
  setQuery: (q: string) => void;
  /** チェックを外すときは、その県の市区町村の選択も外す */
  togglePref: (pref: string) => void;
  toggleCity: (cityKey: string) => void;
  /** 指定の県だけに絞る（市区町村の選択は解除） */
  setSelectedPrefs: (prefs: string[]) => void;
  clearAdvancedFilters: () => void;

  toggleView: () => void;
  select: (no: number | null) => void;
  setStatsOpen: (v: boolean) => void;
  setFilterOpen: (v: boolean) => void;
  showToast: (msg: string) => void;
  hideToast: () => void;

  /** 追従を止めると現在地も消す */
  setTracking: (v: boolean) => void;
  setUserPos: (p: LatLng | null) => void;
}

const systemTheme = (): Theme =>
  window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";

const toggleIn = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export const useStore = create<State>()(
  persist(
    (set) => ({
      category: "pokefuta",
      collected: { pokefuta: {}, pokecen: {} },
      theme: systemTheme(),
      filter: "all",
      query: "",
      selectedPrefs: [],
      selectedCities: [],
      view: "map",
      selected: null,
      statsOpen: false,
      filterOpen: false,
      toast: null,
      tracking: false,
      userPos: null,

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
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

      setFilter: (filter) => set({ filter }),
      setQuery: (query) => set({ query }),
      togglePref: (pref) =>
        set((s) => {
          const removing = s.selectedPrefs.includes(pref);
          return {
            selectedPrefs: toggleIn(s.selectedPrefs, pref),
            selectedCities: removing
              ? s.selectedCities.filter((c) => !c.startsWith(cityKey(pref, "")))
              : s.selectedCities,
          };
        }),
      toggleCity: (cityKey) => set((s) => ({ selectedCities: toggleIn(s.selectedCities, cityKey) })),
      setSelectedPrefs: (selectedPrefs) => set({ selectedPrefs, selectedCities: [] }),
      clearAdvancedFilters: () => set({ selectedPrefs: [], selectedCities: [] }),

      toggleView: () => set((s) => ({ view: s.view === "map" ? "list" : "map" })),
      select: (selected) => set({ selected }),
      setStatsOpen: (statsOpen) => set({ statsOpen }),
      setFilterOpen: (filterOpen) => set({ filterOpen }),
      showToast: (msg) => set({ toast: { id: Date.now(), msg } }),
      hideToast: () => set({ toast: null }),

      setTracking: (tracking) => set(tracking ? { tracking } : { tracking, userPos: null }),
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
      migrate: migrateState,
    }
  )
);
