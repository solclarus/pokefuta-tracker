import type { Item } from "../types";
import { useStore } from "../store";

const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const Ball = () => (
  <svg viewBox="0 0 44 44" className="list-ball" aria-hidden>
    <circle cx="22" cy="22" r="20" fill="#fff" />
    <path d="M2 22a20 20 0 0 1 40 0z" fill="#ff5470" />
    <rect x="2" y="19.5" width="40" height="5" fill="#1c212d" />
    <circle cx="22" cy="22" r="6" fill="#fff" stroke="#1c212d" strokeWidth="3" />
  </svg>
);

export function ListView({ data }: { data: Item[] }) {
  const collected = useStore((s) => s.collected[s.category]);
  const toggleCollected = useStore((s) => s.toggleCollected);
  const select = useStore((s) => s.select);

  return (
    <div className="list-wrap">
      {data.length === 0 && <div className="list-empty">該当するものがありません</div>}
      <ul className="list">
        {data.map((r) => {
          const done = !!collected[r.no];
          const place = r.name ?? `${r.pref}/${r.city}`;
          const sub = r.pokemon?.join("・") ?? `${r.pref}${r.city}`;
          return (
            <li key={r.no} className={`list-item ${done ? "done" : ""}`}>
              <button className="list-main" onClick={() => select(r.no)}>
                {r.thumb ? (
                  <img className="list-thumb" src={r.thumb} loading="lazy" alt="" />
                ) : (
                  <span className="list-thumb list-thumb-ball">
                    <Ball />
                  </span>
                )}
                <span className="list-text">
                  <span className="list-place">{place}</span>
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
                <IconCheck />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
