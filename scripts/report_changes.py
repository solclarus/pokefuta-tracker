#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2つの pokefuta データ（旧・新）を比較し、追加/削除を Markdown で出力する。

    python scripts/report_changes.py OLD.json NEW.json

追加・削除があれば末尾に "changed" と表示（終了コード 0）。
CI からは stdout をコミット本文 / Issue 本文 / ジョブサマリに流用する。
"""
import json
import sys
from pathlib import Path


def load(path: str) -> dict:
    p = Path(path)
    if not p.exists():
        return {}
    with p.open(encoding="utf-8") as f:
        return {r["no"]: r for r in json.load(f)}


def fmt(r: dict) -> str:
    pk = "・".join(r.get("pokemon", []))
    return f"- No.{r['no']} {r['pref']}/{r['city']}" + (f"（{pk}）" if pk else "")


def main() -> None:
    old = load(sys.argv[1]) if len(sys.argv) > 1 else {}
    new = load(sys.argv[2])

    added = sorted(set(new) - set(old))
    removed = sorted(set(old) - set(new))

    lines = [f"現在の総数: **{len(new)}件**", ""]
    if added:
        lines.append(f"### 🆕 追加 {len(added)}件")
        lines += [fmt(new[n]) for n in added]
        lines.append("")
    if removed:
        lines.append(f"### 🗑️ 削除 {len(removed)}件")
        lines += [fmt(old[n]) for n in removed]
        lines.append("")
    if not added and not removed:
        lines.append("変更なし")

    print("\n".join(lines))


if __name__ == "__main__":
    main()
