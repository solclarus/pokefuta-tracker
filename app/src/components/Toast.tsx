import { useEffect } from "react";
import { useStore } from "../store";

export function Toast() {
  const toast = useStore((s) => s.toast);
  const hide = useStore((s) => s.hideToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(hide, 3200);
    return () => clearTimeout(t);
  }, [toast, hide]);

  return (
    <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite" onClick={hide}>
      {toast?.msg}
    </div>
  );
}
