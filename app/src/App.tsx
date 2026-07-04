import { useEffect, useMemo } from "react";
import raw from "./data/pokefuta.json";
import type { Pokefuta } from "./types";
import { useStore } from "./store";
import { Header } from "./components/Header";
import { MapView } from "./components/MapView";
import { ListView } from "./components/ListView";
import { Fabs } from "./components/Fabs";
import { DetailSheet } from "./components/DetailSheet";
import { StatsPanel } from "./components/StatsPanel";

const DATA = raw as Pokefuta[];

export default function App() {
  const theme = useStore((s) => s.theme);
  const filter = useStore((s) => s.filter);
  const query = useStore((s) => s.query);
  const collected = useStore((s) => s.collected);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATA.filter((r) => {
      const done = !!collected[r.no];
      if (filter === "done" && !done) return false;
      if (filter === "todo" && done) return false;
      if (q) {
        const hay = (r.pref + r.city + r.addr + r.pokemon.join("")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filter, query, collected]);

  const view = useStore((s) => s.view);
  const selectedRec = useStore((s) =>
    s.selected == null ? null : DATA.find((r) => r.no === s.selected) ?? null
  );

  return (
    <div className="app">
      <Header total={DATA.length} shown={filtered.length} />
      <div className="stage">
        <MapView data={filtered} />
        {view === "list" && <ListView data={filtered} />}
        <Fabs />
      </div>
      <DetailSheet rec={selectedRec} />
      <StatsPanel data={DATA} />
    </div>
  );
}
