import { describe, expect, it } from "vitest";
import { progressOf, rate } from "./progress";
import { item } from "./test-utils";

describe("progress", () => {
  it("対象アイテム内の取得数だけを数える", () => {
    const p = progressOf([item(1, "東京都", "a"), item(2, "東京都", "b"), item(3, "東京都", "c")], { 1: true, 99: true });
    expect(p).toEqual({ total: 3, done: 1 });
    expect(rate(p)).toBe(33);
    expect(rate(p, 1)).toBe(33.3);
  });

  it("0件なら 0%", () => expect(rate({ total: 0, done: 0 })).toBe(0));
});
