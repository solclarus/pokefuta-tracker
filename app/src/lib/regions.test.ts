import { describe, expect, it } from "vitest";
import { groupByRegion } from "./regions";
import { item } from "./test-utils";

describe("groupByRegion", () => {
  it("地方の定義順・県の五十音順に並べ、空の地方は含めない", () => {
    const groups = groupByRegion([
      item(1, "福岡県", "福岡市"),
      item(2, "東京都", "稲城市"),
      item(3, "千葉県", "千葉市"),
      item(4, "東京都", "府中市"),
    ]);
    expect(groups.map((g) => g.region)).toEqual(["関東", "九州・沖縄"]);
    expect(groups[0].prefs.map((p) => [p.pref, p.items.length])).toEqual([
      ["千葉県", 1],
      ["東京都", 2],
    ]);
    expect(groups[0].items).toHaveLength(3);
  });
});
