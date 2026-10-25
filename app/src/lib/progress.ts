import type { CollectedMap, Item } from "../types";

export interface Progress {
  total: number;
  done: number;
}

export function progressOf(items: Item[], collected: CollectedMap): Progress {
  return { total: items.length, done: items.filter((r) => collected[r.no]).length };
}

/** 達成率（%）。digits で小数点以下の桁数を指定 */
export function rate(p: Progress, digits = 0) {
  if (!p.total) return 0;
  const k = 10 ** digits;
  return Math.round((p.done / p.total) * 100 * k) / k;
}
