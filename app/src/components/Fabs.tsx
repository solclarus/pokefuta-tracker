import { useState } from "react";
import { useStore } from "../store";
import type { FilterMode } from "../types";

const IconList = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="3.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
const IconMap = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4 3 6.5v13L9 17l6 2.5L21 17V4l-6 2.5L9 4z" />
    <path d="M9 4v13M15 6.5v13" />
  </svg>
);
const IconLocate = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);
const IconSun = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const IconMoon = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const FILTER_ORDER: FilterMode[] = ["all", "todo", "done"];
const FILTER_CHAR: Record<FilterMode, string> = { all: "全", todo: "未", done: "済" };

export function Fabs() {
  const view = useStore((s) => s.view);
  const toggleView = useStore((s) => s.toggleView);
  const setUserPos = useStore((s) => s.setUserPos);
  const filter = useStore((s) => s.filter);
  const setFilter = useStore((s) => s.setFilter);
  const query = useStore((s) => s.query);
  const setQuery = useStore((s) => s.setQuery);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const category = useStore((s) => s.category);

  const [locating, setLocating] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cycleFilter = () =>
    setFilter(FILTER_ORDER[(FILTER_ORDER.indexOf(filter) + 1) % FILTER_ORDER.length]);

  const locate = () => {
    if (!navigator.geolocation) {
      alert("この端末では現在地を取得できません。");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert("現在地を取得できませんでした。位置情報の許可を確認してください。");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  return (
    <>
      {searchOpen && (
        <div className="search-overlay">
          <input
            className="search"
            type="search"
            autoFocus
            placeholder={category === "pokefuta" ? "県・市・ポケモンで検索" : "施設名・県で検索"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-close" onClick={() => setSearchOpen(false)} aria-label="閉じる">
            <IconClose />
          </button>
        </div>
      )}

      <div className="fabs">
        <button className="fab" onClick={toggleTheme} title="テーマ切替" aria-label="テーマ切替">
          {theme === "dark" ? <IconSun /> : <IconMoon />}
        </button>
        <button
          className={`fab ${query ? "active" : ""}`}
          onClick={() => setSearchOpen((o) => !o)}
          title="検索"
          aria-label="検索"
        >
          <IconSearch />
        </button>
        <button
          className={`fab ${filter !== "all" ? "active" : ""}`}
          onClick={cycleFilter}
          title={`フィルタ: ${FILTER_CHAR[filter]}`}
          aria-label="フィルタ切替"
        >
          <span className="fab-char">{FILTER_CHAR[filter]}</span>
        </button>
        <button
          className="fab primary"
          onClick={toggleView}
          title={view === "map" ? "リスト表示" : "地図表示"}
          aria-label={view === "map" ? "リスト表示に切替" : "地図表示に切替"}
        >
          {view === "map" ? <IconList /> : <IconMap />}
        </button>
        {view === "map" && (
          <button
            className={`fab ${locating ? "loading" : ""}`}
            onClick={locate}
            title="現在地"
            aria-label="現在地を表示"
          >
            <IconLocate />
          </button>
        )}
      </div>
    </>
  );
}
