import { useState } from "react";
import { useStore } from "../store";

const IconList = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="3.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
const IconMap = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4 3 6.5v13L9 17l6 2.5L21 17V4l-6 2.5L9 4z" />
    <path d="M9 4v13M15 6.5v13" />
  </svg>
);
const IconLocate = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);

export function Fabs() {
  const view = useStore((s) => s.view);
  const toggleView = useStore((s) => s.toggleView);
  const setUserPos = useStore((s) => s.setUserPos);
  const [locating, setLocating] = useState(false);

  const locate = () => {
    if (!navigator.geolocation) {
      alert("この端末では現在地を取得できません。");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert("現在地を取得できませんでした。位置情報の許可を確認してください。");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  return (
    <div className="fabs">
      {view === "map" && (
        <button
          className={`fab ${locating ? "loading" : ""}`}
          onClick={locate}
          title="現在地"
          aria-label="現在地を表示"
        >
          <IconLocate />
        </button>
      )}
      <button
        className="fab primary"
        onClick={toggleView}
        title={view === "map" ? "リスト表示" : "地図表示"}
        aria-label={view === "map" ? "リスト表示に切替" : "地図表示に切替"}
      >
        {view === "map" ? <IconList /> : <IconMap />}
      </button>
    </div>
  );
}
