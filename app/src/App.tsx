import { useEffect, useMemo } from "react";
import { ITEMS } from "./lib/items";
import { filterItems } from "./lib/filter";
import { useStore } from "./store";
import { Hud } from "./components/Hud";
import { MapView } from "./components/MapView";
import { ListView } from "./components/ListView";
import { Fabs } from "./components/Fabs";
import { DetailSheet } from "./components/DetailSheet";
import { StatsPanel } from "./components/StatsPanel";
import { FilterPanel } from "./components/FilterPanel";
import { GeoWatcher } from "./components/GeoWatcher";
import { Toast } from "./components/Toast";

export default function App() {
  const theme = useStore((s) => s.theme);
  const category = useStore((s) => s.category);
  const mode = useStore((s) => s.filter);
  const query = useStore((s) => s.query);
  const prefs = useStore((s) => s.selectedPrefs);
  const cities = useStore((s) => s.selectedCities);
  const collected = useStore((s) => s.collected[s.category]);
  const view = useStore((s) => s.view);
  const selected = useStore((s) => s.selected);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const data = ITEMS[category];
  const filtered = useMemo(
    () => filterItems(data, collected, { mode, query, prefs, cities }),
    [data, collected, mode, query, prefs, cities]
  );
  const selectedRec = selected == null ? null : (data.find((r) => r.no === selected) ?? null);

  return (
    <div className="app">
      <div className="stage">
        <MapView data={filtered} category={category} />
        {view === "list" && <ListView data={filtered} />}
        <Hud total={data.length} />
        <Fabs />
      </div>
      <DetailSheet rec={selectedRec} />
      <StatsPanel data={data} />
      <FilterPanel data={data} />
      <GeoWatcher />
      <Toast />
    </div>
  );
}
