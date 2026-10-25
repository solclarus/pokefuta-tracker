import { useMemo, useState } from "react";
import type { Item } from "../types";
import { useStore } from "../store";
import { byJa, groupByRegion, type Region } from "../lib/regions";
import { cityKey } from "../lib/filter";
import { Panel, RegionRow } from "./Panel";

/** 市区町村名 → 件数（五十音順） */
function cityCounts(items: Item[]) {
  const m = new Map<string, number>();
  for (const r of items) m.set(r.city, (m.get(r.city) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => byJa(a[0], b[0]));
}

export function FilterPanel({ data }: { data: Item[] }) {
  const open = useStore((s) => s.filterOpen);
  const setOpen = useStore((s) => s.setFilterOpen);
  const selectedPrefs = useStore((s) => s.selectedPrefs);
  const selectedCities = useStore((s) => s.selectedCities);
  const togglePref = useStore((s) => s.togglePref);
  const toggleCity = useStore((s) => s.toggleCity);
  const clearAdvancedFilters = useStore((s) => s.clearAdvancedFilters);
  const [expanded, setExpanded] = useState<Region | null>(null);

  const groups = useMemo(() => groupByRegion(data), [data]);
  const activeCount = selectedPrefs.length + selectedCities.length;

  return (
    <Panel
      open={open}
      onClose={() => setOpen(false)}
      title="フィルタ"
      className="filterpanel"
      headExtra={
        activeCount > 0 && (
          <button className="fp-clear" onClick={clearAdvancedFilters}>
            クリア（{activeCount}）
          </button>
        )
      }
    >
      {groups.map(({ region, prefs }) => {
        const isOpen = expanded === region;
        const selectedInRegion = prefs.filter((p) => selectedPrefs.includes(p.pref)).length;
        return (
          <div key={region} className={`region ${isOpen ? "open" : ""}`}>
            <RegionRow name={region} open={isOpen} onToggle={() => setExpanded(isOpen ? null : region)}>
              {selectedInRegion > 0 && <span className="fp-badge">{selectedInRegion}</span>}
            </RegionRow>
            {isOpen && (
              <div className="prefs">
                {prefs.map(({ pref, items }) => {
                  const checked = selectedPrefs.includes(pref);
                  const cities = cityCounts(items);
                  return (
                    <div key={pref} className="fp-pref-group">
                      <label className="fp-check-row">
                        <input type="checkbox" checked={checked} onChange={() => togglePref(pref)} />
                        <span className="pname">{pref}</span>
                        <span className="pcount">{items.length}</span>
                      </label>
                      {checked && cities.length > 1 && (
                        <div className="fp-cities">
                          {cities.map(([city, n]) => {
                            const key = cityKey(pref, city);
                            return (
                              <label key={key} className="fp-check-row fp-city">
                                <input
                                  type="checkbox"
                                  checked={selectedCities.includes(key)}
                                  onChange={() => toggleCity(key)}
                                />
                                <span className="pname">{city}</span>
                                <span className="pcount">{n}</span>
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
    </Panel>
  );
}
