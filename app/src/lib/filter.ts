import type { CollectedMap, FilterMode, Item } from "../types";

/** 県境をまたぐ同名市区町村（例: 府中市）を区別するための複合キー */
export const cityKey = (pref: string, city: string) => `${pref}::${city}`;

export interface FilterCriteria {
  mode: FilterMode;
  query: string;
  prefs: string[];
  cities: string[];
}

const searchText = (r: Item) =>
  (r.pref + r.city + r.addr + (r.name ?? "") + (r.pokemon?.map((p) => p.name).join("") ?? "")).toLowerCase();

export function filterItems(items: Item[], collected: CollectedMap, c: FilterCriteria): Item[] {
  const q = c.query.trim().toLowerCase();
  return items.filter((r) => {
    const done = !!collected[r.no];
    if (c.mode === "done" && !done) return false;
    if (c.mode === "todo" && done) return false;
    if (c.prefs.length && !c.prefs.includes(r.pref)) return false;
    if (c.cities.length && !c.cities.includes(cityKey(r.pref, r.city))) return false;
    if (q && !searchText(r).includes(q)) return false;
    return true;
  });
}
