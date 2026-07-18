import pokefutaRaw from "../../data/pokefuta.json";
import pokecenRaw from "../../data/pokecen.json";
import type { Category, Item, PokemonRef } from "./types";

interface PokefutaRaw {
  no: number; pref: string; city: string; addr: string;
  lat: number; lng: number; pokemon: PokemonRef[];
  img: string; thumb: string;
}
interface PokecenRaw {
  no: number; name: string; pref: string; city: string; addr: string;
  lat: number; lng: number; url: string;
}

const pokefuta: Item[] = (pokefutaRaw as PokefutaRaw[]).map((r) => ({
  category: "pokefuta",
  no: r.no, pref: r.pref, city: r.city, addr: r.addr, lat: r.lat, lng: r.lng,
  url: `https://local.pokemon.jp/manhole/desc/${r.no}/`,
  pokemon: r.pokemon, img: r.img, thumb: r.thumb,
}));

const pokecen: Item[] = (pokecenRaw as PokecenRaw[]).map((r) => ({
  category: "pokecen",
  no: r.no, pref: r.pref, city: r.city, addr: r.addr, lat: r.lat, lng: r.lng,
  url: r.url, name: r.name,
}));

export const ITEMS: Record<Category, Item[]> = { pokefuta, pokecen };

export const CATEGORY_LABEL: Record<Category, string> = {
  pokefuta: "ポケふた",
  pokecen: "ポケセン",
};

export const CATEGORIES: Category[] = ["pokefuta", "pokecen"];
