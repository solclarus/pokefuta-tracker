import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import type { Pokefuta } from "../types";
import { useStore } from "../store";

const TILES = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
};

function pinIcon(rec: Pokefuta, done: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="pin ${done ? "done" : ""}">
      <img src="${rec.thumb}" loading="lazy" onerror="this.src='${rec.img}'" />
      <span class="tip"></span>
    </div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 52],
  });
}

function ClusterLayer({ data }: { data: Pokefuta[] }) {
  const map = useMap();
  const collected = useStore((s) => s.collected);
  const select = useStore((s) => s.select);

  useEffect(() => {
    const group = L.markerClusterGroup({
      maxClusterRadius: 50,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      chunkedLoading: true,
      iconCreateFunction(cluster) {
        const kids = cluster.getAllChildMarkers() as (L.Marker & { no: number })[];
        const n = kids.length;
        const doneN = kids.filter((m) => !!collected[m.no]).length;
        const pct = Math.round((doneN / n) * 100);
        const size = n < 10 ? 40 : n < 50 ? 48 : 56;
        return L.divIcon({
          html: `<div class="cluster" style="width:${size}px;height:${size}px;background:conic-gradient(var(--done) ${pct}%, var(--cluster) 0)"><span>${n}</span></div>`,
          className: "",
          iconSize: [size, size],
        });
      },
    });

    const markers = data.map((rec) => {
      const m = L.marker([rec.lat, rec.lng], {
        icon: pinIcon(rec, !!collected[rec.no]),
      }) as L.Marker & { no: number };
      m.no = rec.no;
      m.on("click", () => select(rec.no));
      return m;
    });
    group.addLayers(markers);
    map.addLayer(group);

    return () => {
      map.removeLayer(group);
    };
  }, [map, data, collected, select]);

  return null;
}

function FlyTo({ data }: { data: Pokefuta[] }) {
  const map = useMap();
  const selected = useStore((s) => s.selected);
  useEffect(() => {
    if (selected == null) return;
    const rec = data.find((r) => r.no === selected);
    if (rec) map.flyTo([rec.lat, rec.lng], Math.max(map.getZoom(), 12), { duration: 0.6 });
  }, [map, selected, data]);
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
    if (!userPos) return;
    if (!markerRef.current) {
      markerRef.current = L.marker(userPos, { icon: userIcon, interactive: false, zIndexOffset: 1000 }).addTo(map);
    } else {
      markerRef.current.setLatLng(userPos);
    }
    map.flyTo(userPos, Math.max(map.getZoom(), 13), { duration: 0.8 });
  }, [map, userPos]);

  useEffect(() => () => {
    if (markerRef.current) markerRef.current.remove();
  }, []);

  return null;
}

export function MapView({ data }: { data: Pokefuta[] }) {
  const theme = useStore((s) => s.theme);
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
          key={theme}
          url={TILES[theme]}
          subdomains="abcd"
          attribution='&copy; OpenStreetMap &copy; CARTO'
          maxZoom={20}
        />
        <ClusterLayer data={data} />
        <FlyTo data={data} />
        <UserMarker />
      </MapContainer>
    </div>
  );
}
