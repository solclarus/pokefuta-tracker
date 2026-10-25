// 地図タイルの提供元。差し替えるときは TILE を変えるだけでよい
// （vite.config.ts の PWA キャッシュ設定もここを参照している）
export interface TileProvider {
  url: string;
  attribution: string;
  maxNativeZoom: number;
  /** PWA でオフラインキャッシュする URL */
  cachePattern: RegExp;
}

export const TILE_PROVIDERS = {
  // OpenStreetMap 標準タイル（APIキー不要）
  osm: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxNativeZoom: 19,
    cachePattern: /^https:\/\/tile\.openstreetmap\.org\/.*/i,
  },
  // 国土地理院 淡色地図（APIキー不要・日本国内向け）
  gsi: {
    url: "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
    attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
    maxNativeZoom: 18,
    cachePattern: /^https:\/\/cyberjapandata\.gsi\.go\.jp\/xyz\/.*/i,
  },
} satisfies Record<string, TileProvider>;

export const TILE: TileProvider = TILE_PROVIDERS.osm;
