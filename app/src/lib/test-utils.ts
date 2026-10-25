import type { Item } from "../types";

export const item = (no: number, pref: string, city: string, extra: Partial<Item> = {}): Item => ({
  category: "pokefuta",
  no,
  pref,
  city,
  addr: "",
  lat: 35,
  lng: 135,
  url: "",
  ...extra,
});
