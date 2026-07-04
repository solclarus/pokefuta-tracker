export type FilterMode = "all" | "todo" | "done";
export type Theme = "dark" | "light";
export type ViewMode = "map" | "list";
export type Category = "pokefuta" | "pokecen";

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
  pokemon?: string[]; // ポケふた: 描かれているポケモン
  zukan?: number[];
  img?: string; // ポケふた: 画像
  thumb?: string;
}
