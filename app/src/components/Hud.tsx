import type { CSSProperties } from "react";
import { useStore } from "../store";
import { CATEGORIES, CATEGORY_LABEL } from "../items";

/** 地図の上に浮かぶカテゴリ切替＋進捗（ヘッダーの代わり） */
export function Hud({ total }: { total: number }) {
  const category = useStore((s) => s.category);
  const setCategory = useStore((s) => s.setCategory);
  const collected = useStore((s) => s.collected[s.category]);
  const setStatsOpen = useStore((s) => s.setStatsOpen);

  const done = Object.keys(collected).length;
  const pct = total ? Math.round((done / total) * 1000) / 10 : 0;

  return (
    <div className="hud">
      <div className="cat-switch" role="tablist" aria-label="カテゴリ">
        <span className="logo" aria-hidden />
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={category === c ? "on" : ""}
            onClick={() => setCategory(c)}
            role="tab"
            aria-selected={category === c}
          >
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      <button
        className="progress-pill"
        onClick={() => setStatsOpen(true)}
        title="達成率を見る"
        aria-label={`達成率 ${pct}%（取得 ${done} / ${total}）`}
      >
        <span className="pp-ring" style={{ "--p": `${pct}%` } as CSSProperties}>
          <span className="pp-pct">{Math.round(pct)}</span>
        </span>
        <span className="pp-frac">
          <b>{done}</b>
          <span className="muted">/{total}</span>
        </span>
      </button>
    </div>
  );
}
