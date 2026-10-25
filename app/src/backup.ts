import type { Category } from "./types";
import { CATEGORIES } from "./items";

export type CollectedMap = Record<number, true>;
export type CollectedAll = Record<Category, CollectedMap>;

/** バックアップファイルの形式（取得済みの番号だけを持つ） */
interface BackupFile {
  app: "pokefuta-tracker";
  version: 1;
  exportedAt: string;
  collected: Record<Category, number[]>;
}

export function toBackup(collected: CollectedAll): BackupFile {
  const out = {} as Record<Category, number[]>;
  for (const c of CATEGORIES) {
    out[c] = Object.keys(collected[c] ?? {}).map(Number).sort((a, b) => a - b);
  }
  return { app: "pokefuta-tracker", version: 1, exportedAt: new Date().toISOString(), collected: out };
}

/** 不正な内容なら Error を投げる */
export function parseBackup(text: string): CollectedAll {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("JSON として読み込めませんでした。");
  }
  const b = json as Partial<BackupFile> | null;
  if (!b || b.app !== "pokefuta-tracker" || typeof b.collected !== "object" || !b.collected) {
    throw new Error("ポケふたチェックリストのバックアップではありません。");
  }
  const out = {} as CollectedAll;
  for (const c of CATEGORIES) {
    const list = (b.collected as Partial<Record<Category, unknown>>)[c] ?? [];
    if (!Array.isArray(list)) throw new Error("バックアップの形式が正しくありません。");
    out[c] = {};
    for (const no of list) {
      if (Number.isInteger(no)) out[c][no as number] = true;
    }
  }
  return out;
}

export function downloadBackup(collected: CollectedAll) {
  const blob = new Blob([JSON.stringify(toBackup(collected), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `pokefuta-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
