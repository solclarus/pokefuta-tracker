import { useRef } from "react";
import { useStore } from "../store";
import { downloadBackup, parseBackup } from "../lib/backup";

export function BackupSection() {
  const mergeCollected = useStore((s) => s.mergeCollected);
  const showToast = useStore((s) => s.showToast);
  const fileRef = useRef<HTMLInputElement>(null);

  const importBackup = async (file: File) => {
    try {
      const incoming = parseBackup(await file.text());
      const n = Object.values(incoming).reduce((sum, m) => sum + Object.keys(m).length, 0);
      mergeCollected(incoming);
      showToast(`バックアップから ${n} 件の取得済みを読み込みました`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "読み込みに失敗しました。");
    }
  };

  return (
    <div className="backup">
      <div className="backup-note">
        取得済みのチェックはこの端末にだけ保存されています。機種変更に備えてバックアップしておけます。
      </div>
      <div className="backup-btns">
        <button className="backup-btn" onClick={() => downloadBackup(useStore.getState().collected)}>
          バックアップを書き出す
        </button>
        <button className="backup-btn" onClick={() => fileRef.current?.click()}>
          バックアップから読み込む
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) importBackup(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
