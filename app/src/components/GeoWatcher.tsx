import { useEffect } from "react";
import { useStore } from "../store";

/** tracking 中は現在地を追い続ける（watchPosition） */
export function GeoWatcher() {
  const tracking = useStore((s) => s.tracking);
  const setUserPos = useStore((s) => s.setUserPos);
  const setTracking = useStore((s) => s.setTracking);
  const showToast = useStore((s) => s.showToast);

  useEffect(() => {
    if (!tracking) return;
    if (!navigator.geolocation) {
      showToast("この端末では現在地を取得できません。");
      setTracking(false);
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {
        showToast("現在地を取得できませんでした。位置情報の許可を確認してください。");
        setTracking(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [tracking, setUserPos, setTracking, showToast]);

  return null;
}
