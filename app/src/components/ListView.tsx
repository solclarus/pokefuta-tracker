import { useMemo } from "react";
import type { Item } from "../types";
import { useStore } from "../store";
import { distanceKm, formatKm } from "../lib/geo";
import { IconCheck, PokeBall } from "./icons";

export function ListView({ data }: { data: Item[] }) {
  const collected = useStore((s) => s.collected[s.category]);
  const toggleCollected = useStore((s) => s.toggleCollected);
  const select = useStore((s) => s.select);
  const userPos = useStore((s) => s.userPos);

  // 現在地があれば近い順に並べる
  const rows = useMemo(() => {
    if (!userPos) return data.map((r) => ({ r, km: null }));
    return data
      .map((r) => ({ r, km: distanceKm(userPos, [r.lat, r.lng]) }))
      .sort((a, b) => a.km - b.km);
  }, [data, userPos]);

  return (
    <div className="list-wrap">
      {data.length === 0 && <div className="list-empty">該当するものがありません</div>}
      {userPos && data.length > 0 && <div className="list-sortnote">現在地から近い順</div>}
      <ul className="list">
        {rows.map(({ r, km }) => {
          const done = !!collected[r.no];
          const place = r.name ?? `${r.pref}/${r.city}`;
          const sub = r.pokemon?.map((p) => p.name).join("・") ?? `${r.pref}${r.city}`;
          return (
            <li key={r.no} className={`list-item ${done ? "done" : ""}`}>
              <button className="list-main" onClick={() => select(r.no)}>
                {r.thumb ? (
                  <img className="list-thumb" src={r.thumb} loading="lazy" alt="" />
                ) : (
                  <span className="list-thumb list-thumb-ball">
                    <PokeBall className="list-ball" />
                  </span>
                )}
                <span className="list-text">
                  <span className="list-place">
                    {place}
                    {km != null && <span className="list-dist">{formatKm(km)}</span>}
                  </span>
                  <span className="list-poke">{sub}</span>
                </span>
              </button>
              <button
                className={`list-check ${done ? "done" : ""}`}
                onClick={() => toggleCollected(r.no)}
                aria-pressed={done}
                aria-label={done ? "取得済み" : "取得済みにする"}
                title={done ? "取得済み" : "取得済みにする"}
              >
                <IconCheck size={16} strokeWidth={2.6} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
