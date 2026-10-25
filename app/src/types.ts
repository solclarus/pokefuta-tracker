export type FilterMode = "all" | "todo" | "done";
export type Theme = "dark" | "light";
export type ViewMode = "map" | "list";
export type Category = "pokefuta" | "pokecen";

export const CATEGORIES: Category[] = ["pokefuta", "pokecen"];

export const CATEGORY_LABEL: Record<Category, string> = {
  pokefuta: "ポケふた",
  pokecen: "ポケセン",
};

/** 取得済みの番号 → true */
export type CollectedMap = Record<number, true>;
export type CollectedAll = Record<Category, CollectedMap>;

/** ポケふたに描かれているポケモン（dex は全国図鑑番号） */
export interface PokemonRef {
  name: string;
  dex: number;
}

/** 地図・リスト・詳細で共通に扱う正規化アイテム */
export interface Item {
  category: Category;
  no: number;
  pref: string;
  city: string;
  addr: string;
  lat: number;
  lng: number;
  url: string;
  name?: string; // ポケセン: 施設名
  pokemon?: PokemonRef[]; // ポケふた: 描かれているポケモン
  img?: string; // ポケふた: 画像
  thumb?: string;
}
