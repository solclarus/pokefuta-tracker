import type { CollectedMap } from "./backup";

/** 保存データの移行。v1 はポケふたのみのフラットな { [no]: true } だった */
export function migrateState(persisted: unknown, version: number): unknown {
  const p = persisted as { collected?: Record<string, unknown> } | undefined;
  if (p && version < 2) {
    const old = p.collected ?? {};
    const isFlat = !("pokefuta" in old) && !("pokecen" in old);
    p.collected = {
      pokefuta: (isFlat ? old : (old as Record<string, CollectedMap>).pokefuta) ?? {},
      pokecen: (old as Record<string, CollectedMap>).pokecen ?? {},
    };
  }
  return p;
}
