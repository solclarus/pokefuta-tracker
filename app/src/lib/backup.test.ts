import { describe, expect, it } from "vitest";
import { parseBackup, toBackup } from "./backup";

describe("backup", () => {
  it("書き出した内容を読み戻せる", () => {
    const collected = { pokefuta: { 3: true, 1: true }, pokecen: { 7: true } } as const;
    const file = toBackup(collected);
    expect(file.collected).toEqual({ pokefuta: [1, 3], pokecen: [7] });
    expect(parseBackup(JSON.stringify(file))).toEqual(collected);
  });

  it("別アプリの JSON は拒否する", () => {
    expect(() => parseBackup(JSON.stringify({ collected: {} }))).toThrow();
    expect(() => parseBackup("not json")).toThrow();
  });

  it("番号以外の値は無視する", () => {
    const text = JSON.stringify({ app: "pokefuta-tracker", collected: { pokefuta: [1, "x", 2.5] } });
    expect(parseBackup(text)).toEqual({ pokefuta: { 1: true }, pokecen: {} });
  });
});
