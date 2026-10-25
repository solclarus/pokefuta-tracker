import type { ReactNode } from "react";

/** 画面下からせり上がるパネル（達成率・フィルタ共通） */
export function Panel({
  open,
  onClose,
  title,
  className = "",
  headExtra,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  className?: string;
  headExtra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <div className={`scrim ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`stats ${className} ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="stats-head">
          <h2>{title}</h2>
          {headExtra}
          <button className="sheet-close" onClick={onClose} aria-label="閉じる">
            ✕
          </button>
        </div>
        <div className="stats-body">{children}</div>
      </aside>
    </>
  );
}

/** 開閉できる地方の行 */
export function RegionRow({
  name,
  open,
  onToggle,
  children,
}: {
  name: string;
  open: boolean;
  onToggle: () => void;
  children?: ReactNode;
}) {
  return (
    <button className="region-row" onClick={onToggle}>
      <span className="caret">{open ? "▾" : "▸"}</span>
      <span className="rname">{name}</span>
      {children}
    </button>
  );
}
