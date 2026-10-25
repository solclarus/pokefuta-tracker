import { useMemo, useState } from "react";
import type { Item } from "../types";
import { useStore } from "../store";
import { groupByRegion, type Region } from "../lib/regions";
import { progressOf, rate, type Progress } from "../lib/progress";
import { Panel, RegionRow } from "./Panel";
import { BackupSection } from "./BackupSection";

function Bar({ p }: { p: Progress }) {
  const full = p.done === p.total && p.total > 0;
  return (
    <div className="stat-bar" title={`${p.done}/${p.total}`}>
      <span style={{ width: `${rate(p)}%` }} className={full ? "full" : ""} />
    </div>
  );
}

export function StatsPanel({ data }: { data: Item[] }) {
  const open = useStore((s) => s.statsOpen);
  const setOpen = useStore((s) => s.setStatsOpen);
  const collected = useStore((s) => s.collected[s.category]);
  const setSelectedPrefs = useStore((s) => s.setSelectedPrefs);
  const setFilter = useStore((s) => s.setFilter);
  const [expanded, setExpanded] = useState<Region | null>(null);

  const groups = useMemo(() => groupByRegion(data), [data]);
  const total = progressOf(data, collected);

  const jumpTo = (pref: string) => {
    setSelectedPrefs([pref]);
    setFilter("all");
    setOpen(false);
  };

  return (
    <Panel
      open={open}
      onClose={() => setOpen(false)}
      title="達成率"
      headExtra={
        <div className="stats-total">
          <b>{total.done}</b> / {total.total}
          <span className="pct">{rate(total)}%</span>
        </div>
      }
    >
      {groups.map(({ region, items, prefs }) => {
        const isOpen = expanded === region;
        const rp = progressOf(items, collected);
        return (
          <div key={region} className={`region ${isOpen ? "open" : ""}`}>
            <RegionRow name={region} open={isOpen} onToggle={() => setExpanded(isOpen ? null : region)}>
              <Bar p={rp} />
              <span className="rpct">{rate(rp)}%</span>
            </RegionRow>
            {isOpen && (
              <div className="prefs">
                {prefs.map(({ pref, items }) => {
                  const pp = progressOf(items, collected);
                  return (
                    <button key={pref} className="pref-row" onClick={() => jumpTo(pref)}>
                      <span className="pname">{pref}</span>
                      <Bar p={pp} />
                      <span className="pcount">
                        {pp.done}/{pp.total}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      <BackupSection />
    </Panel>
  );
}
