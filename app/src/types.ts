export interface Pokefuta {
  no: number;
  pref: string;
  city: string;
  addr: string;
  lat: number;
  lng: number;
  pokemon: string[];
  zukan: number[];
  img: string;
  thumb: string;
}

export type FilterMode = "all" | "todo" | "done";
export type Theme = "dark" | "light";
export type ViewMode = "map" | "list";
