import { useMemo, useState } from "react";
import type { Item } from "../types";
import { useStore } from "../store";
import { REGION_ORDER, regionOf, type Region } from "../regions";
import { cityKey } from "../utils";

export function FilterPanel({ data }: { data: Item[] }) {
  const open = useStore((s) => s.filterOpen);
  const setOpen = useStore((s) => s.setFilterOpen);
  const selectedPrefs = useStore((s) => s.selectedPrefs);
  const selectedCities = useStore((s) => s.selectedCities);
  const togglePref = useStore((s) => s.togglePref);
  const toggleCity = useStore((s) => s.toggleCity);
  const clearAdvancedFilters = useStore((s) => s.clearAdvancedFilters);
  const [expanded, setExpanded] = useState<Region | null>(null);

  const byRegion = useMemo(() => {
    const m = new Map<Region, Map<string, Map<string, number>>>(); // region -> pref -> city -> count
    for (const r of data) {
      const reg = regionOf(r.pref);
      const prefs = m.get(reg) ?? new Map<string, Map<string, number>>();
      const cities = prefs.get(r.pref) ?? new Map<string, number>();
      cities.set(r.city, (cities.get(r.city) ?? 0) + 1);
      prefs.set(r.pref, cities);
      m.set(reg, prefs);
    }
    return m;
  }, [data]);

  const activeCount = selectedPrefs.length + selectedCities.length;

  const onTogglePref = (pref: string, cities: Map<string, number>) => {
    const wasChecked = selectedPrefs.includes(pref);
    togglePref(pref);
    if (wasChecked) {
      for (const city of cities.keys()) {
        const key = cityKey(pref, city);
        if (selectedCities.includes(key)) toggleCity(key);
      }
    }
  };

  return (
    <>
      <div className={`scrim ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`stats filterpanel ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="stats-head">
          <h2>フィルタ</h2>
          {activeCount > 0 && (
            <button className="fp-clear" onClick={clearAdvancedFilters}>
              クリア（{activeCount}）
            </button>
          )}
          <button className="sheet-close" onClick={() => setOpen(false)} aria-label="閉じる">
            ✕
          </button>
        </div>
        <div className="stats-body">
          {REGION_ORDER.map((reg) => {
            const prefs = byRegion.get(reg);
            if (!prefs) return null;
            const isOpen = expanded === reg;
            const sortedPrefs = [...prefs.keys()].sort((a, b) => a.localeCompare(b, "ja"));
            const regionSelectedCount = sortedPrefs.filter((p) => selectedPrefs.includes(p)).length;
            return (
              <div key={reg} className={`region ${isOpen ? "open" : ""}`}>
                <button className="region-row" onClick={() => setExpanded(isOpen ? null : reg)}>
                  <span className="caret">{isOpen ? "▾" : "▸"}</span>
                  <span className="rname">{reg}</span>
                  {regionSelectedCount > 0 && <span className="fp-badge">{regionSelectedCount}</span>}
                </button>
                {isOpen && (
                  <div className="prefs">
                    {sortedPrefs.map((pref) => {
                      const cities = prefs.get(pref)!;
                      const checked = selectedPrefs.includes(pref);
                      const sortedCities = [...cities.keys()].sort((a, b) => a.localeCompare(b, "ja"));
                      const prefTotal = sortedCities.reduce((sum, c) => sum + (cities.get(c) ?? 0), 0);
                      return (
                        <div key={pref} className="fp-pref-group">
                          <label className="fp-check-row">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => onTogglePref(pref, cities)}
                            />
                            <span className="pname">{pref}</span>
                            <span className="pcount">{prefTotal}</span>
                          </label>
                          {checked && sortedCities.length > 1 && (
                            <div className="fp-cities">
                              {sortedCities.map((city) => {
                                const key = cityKey(pref, city);
                                return (
                                  <label key={key} className="fp-check-row fp-city">
                                    <input
                                      type="checkbox"
                                      checked={selectedCities.includes(key)}
                                      onChange={() => toggleCity(key)}
                                    />
                                    <span className="pname">{city}</span>
                                    <span className="pcount">{cities.get(city)}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
