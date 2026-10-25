import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import type { Category, Item } from "../types";
import { useStore } from "../store";
import { TILE } from "../tiles";


// ポケセン用のポケボール型ピン（画像を持たないアイテム向け）
const BALL = `<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#fff"/><path d="M2 22a20 20 0 0 1 40 0z" fill="#ff5470"/><rect x="2" y="19.5" width="40" height="5" fill="#1c212d"/><circle cx="22" cy="22" r="6" fill="#fff" stroke="#1c212d" stroke-width="3"/></svg>`;

function pinIcon(rec: Item, done: boolean) {
  const inner = rec.img
    ? `<img src="${rec.thumb}" loading="lazy" onerror="this.src='${rec.img}'" />`
    : `<span class="ball">${BALL}</span>`;
  return L.divIcon({
    className: "",
    html: `<div class="pin ${done ? "done" : ""}">${inner}<span class="tip"></span></div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 52],
  });
}

type PinMarker = L.Marker & { no: number };

function ClusterLayer({ data }: { data: Item[] }) {
  const map = useMap();
  const collected = useStore((s) => s.collected[s.category]);
  const select = useStore((s) => s.select);
  // マーカー生成時の初期状態は最新の取得状況を ref 経由で参照する
  const collectedRef = useRef(collected);
  useEffect(() => {
    collectedRef.current = collected;
  }, [collected]);
  const groupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<PinMarker[]>([]);
  // 各ピンに今描画している取得状態（クラスタの達成率もここから数える）
  const doneRef = useRef(new Map<number, boolean>());

  // data が変わったときだけマーカーを作り直す
  useEffect(() => {
    const group = L.markerClusterGroup({
      maxClusterRadius: 50,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      chunkedLoading: true,
      iconCreateFunction(cluster) {
        const kids = cluster.getAllChildMarkers() as PinMarker[];
        const n = kids.length;
        const doneN = kids.filter((m) => doneRef.current.get(m.no)).length;
        const pct = Math.round((doneN / n) * 100);
        const size = n < 10 ? 40 : n < 50 ? 48 : 56;
        return L.divIcon({
          html: `<div class="cluster" style="width:${size}px;height:${size}px;background:conic-gradient(var(--done) ${pct}%, var(--cluster) 0)"><span>${n}</span></div>`,
          className: "",
          iconSize: [size, size],
        });
      },
    });

    const doneMap = doneRef.current;
    doneMap.clear();
    const markers = data.map((rec) => {
      const done = !!collectedRef.current[rec.no];
      const m = L.marker([rec.lat, rec.lng], { icon: pinIcon(rec, done) }) as PinMarker;
      m.no = rec.no;
      doneMap.set(rec.no, done);
      m.on("click", () => select(rec.no));
      return m;
    });
    group.addLayers(markers);
    map.addLayer(group);
    groupRef.current = group;
    markersRef.current = markers;

    return () => {
      map.removeLayer(group);
      groupRef.current = null;
      markersRef.current = [];
    };
  }, [map, data, select]);

  // 取得状況の変化は、変わったピンのアイコンと親クラスタだけ更新する
  useEffect(() => {
    const changed: PinMarker[] = [];
    const doneMap = doneRef.current;
    const byNo = new Map(data.map((r) => [r.no, r]));
    for (const m of markersRef.current) {
      const done = !!collected[m.no];
      if (doneMap.get(m.no) === done) continue;
      doneMap.set(m.no, done);
      const rec = byNo.get(m.no);
      if (rec) m.setIcon(pinIcon(rec, done));
      changed.push(m);
    }
    if (changed.length) groupRef.current?.refreshClusters(changed);
  }, [collected, data]);

  return null;
}

function FlyTo({ data }: { data: Item[] }) {
  const map = useMap();
  const selected = useStore((s) => s.selected);
  useEffect(() => {
    if (selected == null) return;
    const rec = data.find((r) => r.no === selected);
    if (rec) map.flyTo([rec.lat, rec.lng], Math.max(map.getZoom(), 12), { duration: 0.6 });
  }, [map, selected, data]);
  return null;
}

// カテゴリ切替時に全アイテムが収まるよう地図を合わせる
function FitOnCategory({ data, category }: { data: Item[]; category: Category }) {
  const map = useMap();
  useEffect(() => {
    if (!data.length) return;
    const bounds = L.latLngBounds(data.map((r) => [r.lat, r.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8, animate: true });
    // data ではなく category の変化時のみ実行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);
  return null;
}

// モバイルのツールバー開閉やアドレスバーの伸縮で高さが変わったとき、
// Leaflet の内部サイズを更新して下部のタイル欠けを防ぐ
function ResizeFix() {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize();
    window.addEventListener("resize", fix);
    window.addEventListener("orientationchange", fix);
    const t = setTimeout(fix, 300);
    return () => {
      window.removeEventListener("resize", fix);
      window.removeEventListener("orientationchange", fix);
      clearTimeout(t);
    };
  }, [map]);
  return null;
}

const userIcon = L.divIcon({
  className: "",
  html: `<div class="user-dot"><span class="pulse"></span></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function UserMarker() {
  const map = useMap();
  const userPos = useStore((s) => s.userPos);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!userPos) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    if (!markerRef.current) {
      // 追従開始後の最初の位置でだけ地図を寄せる（以降はマーカーのみ動かす）
      markerRef.current = L.marker(userPos, { icon: userIcon, interactive: false, zIndexOffset: 1000 }).addTo(map);
      map.flyTo(userPos, Math.max(map.getZoom(), 13), { duration: 0.8 });
    } else {
      markerRef.current.setLatLng(userPos);
    }
  }, [map, userPos]);

  useEffect(() => () => {
    if (markerRef.current) markerRef.current.remove();
  }, []);

  return null;
}

export function MapView({ data, category }: { data: Item[]; category: Category }) {
  return (
    <div className="map-wrap">
      <MapContainer
        className="map"
        center={[37.5, 137.5]}
        zoom={5}
        minZoom={4}
        maxZoom={19}
        zoomControl={false}
        worldCopyJump
      >
        <TileLayer
          url={TILE.url}
          attribution={TILE.attribution}
          maxNativeZoom={TILE.maxNativeZoom}
          maxZoom={19}
        />
        <ClusterLayer data={data} />
        <FlyTo data={data} />
        <FitOnCategory data={data} category={category} />
        <ResizeFix />
        <UserMarker />
      </MapContainer>
    </div>
  );
}
