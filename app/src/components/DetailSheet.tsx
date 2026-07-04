import type { Pokefuta } from "../types";
import { useStore } from "../store";

const IconMap = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4 3 6.5v13L9 17l6 2.5L21 17V4l-6 2.5L9 4z" />
    <path d="M9 4v13M15 6.5v13" />
  </svg>
);
const IconLink = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4h6v6M20 4l-8.5 8.5" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export function DetailSheet({ rec }: { rec: Pokefuta | null }) {
  const collected = useStore((s) => s.collected);
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
          <IconClose />
        </button>
        {rec && (
          <div className="sheet-in">
            <div className={`hero-wrap ${done ? "done" : ""}`}>
              <img
                className="hero"
                src={rec.img}
                alt=""
                onError={(e) => (e.currentTarget.style.visibility = "hidden")}
              />
              {done && (
                <span className="hero-badge" aria-label="取得済み">
                  <IconCheck />
                </span>
              )}
            </div>

            <div className="sheet-title">
              <div className="overline">{rec.pref}</div>
              <h2>{rec.city}</h2>
            </div>

            <div className="chips">
              {rec.pokemon.map((p, i) => (
                <span key={i} className="chip">
                  {p}
                </span>
              ))}
            </div>

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
                <IconMap />
              </a>
              <a
                className="ghost-btn"
                href={`https://local.pokemon.jp/manhole/desc/${rec.no}/`}
                target="_blank"
                rel="noopener noreferrer"
                title="公式ページを開く"
                aria-label="公式ページを開く"
              >
                <IconLink />
              </a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
