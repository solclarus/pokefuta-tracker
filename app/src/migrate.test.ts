import { describe, expect, it } from "vitest";
import { migrateState } from "./migrate";

describe("migrateState", () => {
  it("v1 のフラットな取得済みをポケふたに移す", () => {
    const out = migrateState({ collected: { 1: true, 5: true } }, 1);
    expect(out).toEqual({ collected: { pokefuta: { 1: true, 5: true }, pokecen: {} } });
  });

  it("カテゴリ別の形式はそのまま保つ", () => {
    const out = migrateState({ collected: { pokefuta: { 2: true }, pokecen: { 3: true } } }, 1);
    expect(out).toEqual({ collected: { pokefuta: { 2: true }, pokecen: { 3: true } } });
  });

  it("v2 以降は変更しない", () => {
    const state = { collected: { pokefuta: { 2: true }, pokecen: {} } };
    expect(migrateState(state, 2)).toEqual(state);
  });
});
