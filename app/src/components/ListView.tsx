import type { Pokefuta } from "../types";
import { useStore } from "../store";

const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export function ListView({ data }: { data: Pokefuta[] }) {
  const collected = useStore((s) => s.collected);
  const toggleCollected = useStore((s) => s.toggleCollected);
  const select = useStore((s) => s.select);

  return (
    <div className="list-wrap">
      {data.length === 0 && <div className="list-empty">該当するポケふたがありません</div>}
      <ul className="list">
        {data.map((r) => {
          const done = !!collected[r.no];
          return (
            <li key={r.no} className={`list-item ${done ? "done" : ""}`}>
              <button className="list-main" onClick={() => select(r.no)}>
                <img className="list-thumb" src={r.thumb} loading="lazy" alt="" />
                <span className="list-text">
                  <span className="list-place">
                    {r.pref}
                    <span className="sep">/</span>
                    {r.city}
                  </span>
                  <span className="list-poke">{r.pokemon.join("・")}</span>
                </span>
              </button>
              <button
                className={`list-check ${done ? "done" : ""}`}
                onClick={() => toggleCollected(r.no)}
                aria-pressed={done}
                aria-label={done ? "取得済み" : "取得済みにする"}
                title={done ? "取得済み" : "取得済みにする"}
              >
                <IconCheck />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
