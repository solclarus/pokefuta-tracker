import { useMemo, useState } from "react";
import type { Pokefuta } from "../types";
import { useStore } from "../store";
import { REGION_ORDER, regionOf, type Region } from "../regions";

interface Cnt {
  total: number;
  done: number;
}
const rate = (c: Cnt) => (c.total ? Math.round((c.done / c.total) * 100) : 0);

function Bar({ c }: { c: Cnt }) {
  const r = rate(c);
  const full = c.done === c.total && c.total > 0;
  return (
    <div className="stat-bar" title={`${c.done}/${c.total}`}>
      <span
        style={{ width: `${r}%` }}
        className={full ? "full" : ""}
      />
    </div>
  );
}

export function StatsPanel({ data }: { data: Pokefuta[] }) {
  const open = useStore((s) => s.statsOpen);
  const setOpen = useStore((s) => s.setStatsOpen);
  const collected = useStore((s) => s.collected);
  const setQuery = useStore((s) => s.setQuery);
  const setFilter = useStore((s) => s.setFilter);
  const [expanded, setExpanded] = useState<Region | null>(null);

  const { byRegion, byPref, total } = useMemo(() => {
    const byRegion = new Map<Region, Cnt>();
    const byPref = new Map<Region, Map<string, Cnt>>();
    const total: Cnt = { total: 0, done: 0 };
    for (const r of data) {
      const reg = regionOf(r.pref);
      const done = !!collected[r.no];
      const rc = byRegion.get(reg) ?? { total: 0, done: 0 };
      rc.total++;
      if (done) rc.done++;
      byRegion.set(reg, rc);
      const pm = byPref.get(reg) ?? new Map<string, Cnt>();
      const pc = pm.get(r.pref) ?? { total: 0, done: 0 };
      pc.total++;
      if (done) pc.done++;
      pm.set(r.pref, pc);
      byPref.set(reg, pm);
      total.total++;
      if (done) total.done++;
    }
    return { byRegion, byPref, total };
  }, [data, collected]);

  const jumpTo = (pref: string) => {
    setQuery(pref);
    setFilter("all");
    setOpen(false);
  };

  return (
    <>
      <div className={`scrim ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`stats ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="stats-head">
          <h2>達成率</h2>
          <div className="stats-total">
            <b>{total.done}</b> / {total.total}
            <span className="pct">{rate(total)}%</span>
          </div>
          <button className="sheet-close" onClick={() => setOpen(false)} aria-label="閉じる">
            ✕
          </button>
        </div>
        <div className="stats-body">
          {REGION_ORDER.map((reg) => {
            const rc = byRegion.get(reg);
            if (!rc) return null;
            const isOpen = expanded === reg;
            const prefs = [...(byPref.get(reg)?.entries() ?? [])].sort((a, b) =>
              a[0].localeCompare(b[0], "ja")
            );
            return (
              <div key={reg} className={`region ${isOpen ? "open" : ""}`}>
                <button className="region-row" onClick={() => setExpanded(isOpen ? null : reg)}>
                  <span className="caret">{isOpen ? "▾" : "▸"}</span>
                  <span className="rname">{reg}</span>
                  <Bar c={rc} />
                  <span className="rpct">{rate(rc)}%</span>
                </button>
                {isOpen && (
                  <div className="prefs">
                    {prefs.map(([pref, pc]) => (
                      <button key={pref} className="pref-row" onClick={() => jumpTo(pref)}>
                        <span className="pname">{pref}</span>
                        <Bar c={pc} />
                        <span className="pcount">
                          {pc.done}/{pc.total}
                        </span>
                      </button>
                    ))}
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
