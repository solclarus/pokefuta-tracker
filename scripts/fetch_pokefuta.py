#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ポケふた全件データの取得・生成スクリプト。

公式サイト local.pokemon.jp の個別ページ（/manhole/desc/{id}/?is_modal=1）を
ID 1..MAX_ID まで走査し、実在する全ポケふたを取得する。検索インデックスに
依存しないため、追加されたばかりの新しいポケふたも確実に拾える。

出力:
  - data/pokefuta.json … 全項目データ（React アプリもここを直接 import する）

新しいポケふたが追加されたら、このスクリプトを実行するだけで全成果物が更新される:
  python3 scripts/fetch_pokefuta.py
"""
import urllib.request
import re
import json
import html
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

BASE = "https://local.pokemon.jp"
MAX_ID = 500  # 現行の最大は 480。追加分を自動検出できるよう少し上まで走査する。
ROOT = Path(__file__).resolve().parent.parent

# 公式データが不正確で手動修正しているため、fetch で上書きしないポケふた。
# 既存の data/pokefuta.json の該当レコードをそのまま引き継ぐ。
#   No.448 ポケパーク カントー: 公式は市区町村が施設名「ポケパーク カントー」だが
#   実際の所在地は東京都稲城市。手動修正を優先する。
PRESERVE: set[int] = {448}


def fetch(i: int) -> str:
    url = f"{BASE}/manhole/desc/{i}/?is_modal=1"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    for _ in range(3):
        try:
            return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")
        except Exception:
            continue
    return ""


def parse(i: int, h: str):
    m = re.search(r'<div class="detail-manhole">(.*?)</body>', h, re.S)
    if not m:
        return None
    body = m.group(1)
    h1 = re.search(r"<h1>([^<]*)</h1>", body)
    title = html.unescape(h1.group(1).strip()) if h1 else ""
    if not title:  # 存在しない ID（欠番）
        return None
    pref, city = (title.split("/", 1) + [""])[:2]
    coord = re.search(r"maps\.google\.com/maps\?q=([0-9.]+),([0-9.]+)", body)
    if not coord:
        return None
    lat, lng = coord.group(1), coord.group(2)
    addr_m = re.search(r'<div class="block map">.*?<p>([^<]*)</p>', body, re.S)
    address = html.unescape(addr_m.group(1).strip()) if addr_m else ""
    pokes = re.findall(
        r'zukan\.pokemon\.co\.jp/detail/(\d+)"[^>]*>\s*<span>([^<]+)</span>', body
    )
    img_m = re.search(r'<img src="([^"]+_l\.png)"', body)
    img = (BASE + img_m.group(1)) if img_m else ""
    return {
        "no": i,
        "pref": pref,
        "city": city,
        "addr": address,
        "lat": float(lat),
        "lng": float(lng),
        "pokemon": [
            {"name": html.unescape(p[1]).strip(), "dex": int(p[0])} for p in pokes
        ],
        "img": img,
        "thumb": img.replace("_l.png", "_s.png"),
    }


def work(i: int):
    h = fetch(i)
    return parse(i, h) if h else None


def main():
    with ThreadPoolExecutor(max_workers=8) as ex:
        recs = [r for r in ex.map(work, range(1, MAX_ID + 1)) if r]
    recs.sort(key=lambda r: r["no"])
    print(f"取得件数: {len(recs)}  (ID {recs[0]['no']}..{recs[-1]['no']})", file=sys.stderr)

    data_dir = ROOT / "data"
    data_dir.mkdir(exist_ok=True)

    # 手動修正済みレコードは既存の canonical データから引き継ぐ（上書きしない）
    canonical = data_dir / "pokefuta.json"
    if PRESERVE and canonical.exists():
        existing = {r["no"]: r for r in json.loads(canonical.read_text(encoding="utf-8"))}
        kept = [n for n in PRESERVE if n in existing]
        recs = [existing[r["no"]] if r["no"] in PRESERVE and r["no"] in existing else r
                for r in recs]
        if kept:
            print(f"手動修正を保持: {sorted(kept)}", file=sys.stderr)

    canonical.write_text(
        json.dumps(recs, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )

    print("生成: data/pokefuta.json", file=sys.stderr)


if __name__ == "__main__":
    main()
