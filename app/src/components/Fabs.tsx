import { useState } from "react";
import { useStore } from "../store";
import type { FilterMode } from "../types";
import { IconClose, IconFilter, IconList, IconLocate, IconMap, IconMoon, IconSearch, IconSun } from "./icons";

const FILTER_ORDER: FilterMode[] = ["all", "todo", "done"];
const FILTER_CHAR: Record<FilterMode, string> = { all: "全", todo: "未", done: "済" };

export function Fabs() {
  const view = useStore((s) => s.view);
  const toggleView = useStore((s) => s.toggleView);
  const tracking = useStore((s) => s.tracking);
  const setTracking = useStore((s) => s.setTracking);
  const locating = useStore((s) => s.tracking && !s.userPos);
  const filter = useStore((s) => s.filter);
  const setFilter = useStore((s) => s.setFilter);
  const query = useStore((s) => s.query);
  const setQuery = useStore((s) => s.setQuery);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const category = useStore((s) => s.category);
  const setFilterOpen = useStore((s) => s.setFilterOpen);
  const advancedFilterCount =
    useStore((s) => s.selectedPrefs.length) + useStore((s) => s.selectedCities.length);

  const [searchOpen, setSearchOpen] = useState(false);

  const cycleFilter = () =>
    setFilter(FILTER_ORDER[(FILTER_ORDER.indexOf(filter) + 1) % FILTER_ORDER.length]);

  // 押すたびに現在地の追従を開始／停止する
  const locate = () => setTracking(!tracking);

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
            <IconClose size={18} />
          </button>
        </div>
      )}

      <div className="fabs">
        <button className="fab" onClick={toggleTheme} title="テーマ切替" aria-label="テーマ切替">
          {theme === "dark" ? <IconSun size={21} /> : <IconMoon size={21} />}
        </button>
        <button
          className={`fab ${filter !== "all" ? "active" : ""}`}
          onClick={cycleFilter}
          title={`達成状況: ${FILTER_CHAR[filter]}`}
          aria-label="達成状況フィルタ切替"
        >
          <span className="fab-char">{FILTER_CHAR[filter]}</span>
        </button>
        <button
          className="fab primary"
          onClick={toggleView}
          title={view === "map" ? "リスト表示" : "地図表示"}
          aria-label={view === "map" ? "リスト表示に切替" : "地図表示に切替"}
        >
          {view === "map" ? <IconList size={22} /> : <IconMap size={22} />}
        </button>
        <button
          className={`fab ${locating ? "loading" : tracking ? "active" : ""}`}
          onClick={locate}
          title={tracking ? "現在地の追従を止める" : "現在地（近い順）"}
          aria-label={tracking ? "現在地の追従を止める" : "現在地を表示"}
          aria-pressed={tracking}
        >
          <IconLocate size={22} />
        </button>
      </div>

      <div className="fabs fabs-right">
        <button
          className={`fab ${query ? "active" : ""}`}
          onClick={() => setSearchOpen((o) => !o)}
          title="検索"
          aria-label="検索"
        >
          <IconSearch size={21} />
        </button>
        <button
          className={`fab ${advancedFilterCount > 0 ? "active" : ""}`}
          onClick={() => setFilterOpen(true)}
          title="フィルタ（都道府県・市区町村）"
          aria-label="フィルタを開く"
        >
          <IconFilter size={21} />
          {advancedFilterCount > 0 && <span className="fab-badge">{advancedFilterCount}</span>}
        </button>
      </div>
    </>
  );
}
