import { describe, expect, it } from "vitest";
import { cityKey, filterItems, type FilterCriteria } from "./filter";
import { item } from "./test-utils";

const items = [
  item(1, "東京都", "府中市", { pokemon: [{ name: "ピカチュウ", dex: 25 }] }),
  item(2, "広島県", "府中市"),
  item(3, "東京都", "稲城市"),
];
const none: FilterCriteria = { mode: "all", query: "", prefs: [], cities: [] };
const nos = (c: Partial<FilterCriteria>, collected = {}) =>
  filterItems(items, collected, { ...none, ...c }).map((r) => r.no);

describe("filterItems", () => {
  it("条件なしなら全件", () => expect(nos({})).toEqual([1, 2, 3]));

  it("取得状況で絞る", () => {
    expect(nos({ mode: "done" }, { 2: true })).toEqual([2]);
    expect(nos({ mode: "todo" }, { 2: true })).toEqual([1, 3]);
  });

  it("同名の市でも県で区別する", () => {
    expect(nos({ cities: [cityKey("広島県", "府中市")] })).toEqual([2]);
  });

  it("県とポケモン名で検索できる", () => {
    expect(nos({ prefs: ["東京都"] })).toEqual([1, 3]);
    expect(nos({ query: " ピカチュウ " })).toEqual([1]);
  });
});
