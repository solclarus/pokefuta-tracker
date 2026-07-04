import { useStore } from "../store";
import type { FilterMode } from "../types";

const FILTERS: { key: FilterMode; label: string }[] = [
  { key: "all", label: "全て" },
  { key: "todo", label: "未取得" },
  { key: "done", label: "取得済" },
];

const IconChart = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <rect x="7" y="12" width="3" height="6" rx="0.5" />
    <rect x="12" y="8" width="3" height="10" rx="0.5" />
    <rect x="17" y="5" width="3" height="13" rx="0.5" />
  </svg>
);
const IconSun = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const IconMoon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export function Header({ total, shown }: { total: number; shown: number }) {
  const collected = useStore((s) => s.collected);
  const filter = useStore((s) => s.filter);
  const query = useStore((s) => s.query);
  const theme = useStore((s) => s.theme);
  const setFilter = useStore((s) => s.setFilter);
  const setQuery = useStore((s) => s.setQuery);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const setStatsOpen = useStore((s) => s.setStatsOpen);

  const done = Object.keys(collected).length;
  const pct = total ? Math.round((done / total) * 1000) / 10 : 0;

  return (
    <header className="header">
      <div className="header-top">
        <div className="brand">
          <span className="logo" aria-hidden />
          <span className="brand-txt">
            ポケ<b>ふた</b>
          </span>
        </div>

        <div className="progress" title={`表示中 ${shown} 件`}>
          <div className="progress-bar">
            <span style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
          </div>
          <div className="progress-txt">
            <b>{done}</b>
            <span className="muted"> / {total}</span>
            <span className="pct">{pct}%</span>
          </div>
        </div>

        <button className="icon-btn" onClick={() => setStatsOpen(true)} title="達成率" aria-label="達成率">
          <IconChart />
        </button>
        <button className="icon-btn" onClick={toggleTheme} title="テーマ切替" aria-label="テーマ切替">
          {theme === "dark" ? <IconSun /> : <IconMoon />}
        </button>
      </div>

      <div className="header-controls">
        <input
          className="search"
          type="search"
          placeholder="県・市・ポケモンで検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="seg" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={filter === f.key ? "on" : ""}
              onClick={() => setFilter(f.key)}
              role="tab"
              aria-selected={filter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
