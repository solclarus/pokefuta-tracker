import type { Item } from "../types";
import { useStore } from "../store";
import { IconCheck, IconClose, IconLink, IconMap, PokeBall } from "./icons";

export function DetailSheet({ rec }: { rec: Item | null }) {
  const collected = useStore((s) => s.collected[s.category]);
  const toggleCollected = useStore((s) => s.toggleCollected);
  const select = useStore((s) => s.select);

  const open = !!rec;
  const done = rec ? !!collected[rec.no] : false;

  return (
    <>
      <div className={`scrim ${open ? "show" : ""}`} onClick={() => select(null)} />
      <aside className={`sheet ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="grip" />
        <button className="sheet-close" onClick={() => select(null)} aria-label="閉じる">
          <IconClose size={16} />
        </button>
        {rec && (
          <div className="sheet-in">
            <div className={`hero-wrap ${done ? "done" : ""}`}>
              {rec.img ? (
                <img
                  className="hero"
                  src={rec.img}
                  alt=""
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />
              ) : (
                <span className="hero hero-ballwrap">
                  <PokeBall className="hero-ball" />
                </span>
              )}
              {done && (
                <span className="hero-badge" aria-label="取得済み">
                  <IconCheck />
                </span>
              )}
            </div>

            <div className="sheet-title">
              <div className="overline">{rec.name ? `${rec.pref}${rec.city}` : rec.pref}</div>
              <h2>{rec.name ?? rec.city}</h2>
            </div>

            {rec.pokemon?.length ? (
              <div className="chips">
                {rec.pokemon.map((p, i) => (
                  <span key={i} className="chip">
                    {p.name}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="sheet-divider" />

            <button
              className={`toggle ${done ? "done" : ""}`}
              onClick={() => toggleCollected(rec.no)}
              aria-pressed={done}
            >
              <span className="toggle-check">
                <IconCheck />
              </span>
              <span className="toggle-label">
                {done ? "取得済み" : "取得済みにする"}
              </span>
            </button>

            <div className="sheet-actions">
              <a
                className="ghost-btn"
                href={`https://www.google.com/maps/search/?api=1&query=${rec.lat},${rec.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Googleマップで開く"
                aria-label="Googleマップで開く"
              >
                <IconMap strokeWidth={1.8} />
              </a>
              <a
                className="ghost-btn"
                href={rec.url}
                target="_blank"
                rel="noopener noreferrer"
                title="公式ページを開く"
                aria-label="公式ページを開く"
              >
                <IconLink strokeWidth={1.8} />
              </a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
