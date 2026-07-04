import { useEffect, useMemo } from "react";
import { ITEMS } from "./items";
import type { Item } from "./types";
import { useStore } from "./store";
import { Hud } from "./components/Hud";
import { MapView } from "./components/MapView";
import { ListView } from "./components/ListView";
import { Fabs } from "./components/Fabs";
import { DetailSheet } from "./components/DetailSheet";
import { StatsPanel } from "./components/StatsPanel";

const searchText = (r: Item) =>
  (r.pref + r.city + r.addr + (r.name ?? "") + (r.pokemon?.join("") ?? "")).toLowerCase();

export default function App() {
  const theme = useStore((s) => s.theme);
  const category = useStore((s) => s.category);
  const filter = useStore((s) => s.filter);
  const query = useStore((s) => s.query);
  const collected = useStore((s) => s.collected[s.category]);
  const view = useStore((s) => s.view);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const data = ITEMS[category];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((r) => {
      const done = !!collected[r.no];
      if (filter === "done" && !done) return false;
      if (filter === "todo" && done) return false;
      if (q && !searchText(r).includes(q)) return false;
      return true;
    });
  }, [data, filter, query, collected]);

  const selectedRec = useStore((s) =>
    s.selected == null ? null : ITEMS[s.category].find((r) => r.no === s.selected) ?? null
  );

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
    </div>
  );
}
