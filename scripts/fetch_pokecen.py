#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ポケモンセンタースタンプラリー2026（全18か所）のデータ生成。

公式店舗ページ（www.pokemon.co.jp/shop/pokecen/{slug}/）から
名称・住所（JSON-LD）・座標（地図埋め込み !2d{lng}!3d{lat}）を取得する。
Pokémon GO Lab. は店舗ページが無いため手動で補う。

出力:
  - data/pokecen.json
  - app/src/data/pokecen.json

参考: 対象 = 全国のポケモンセンター17店舗 + Pokémon GO Lab.（サンシャインシティ）
"""
import urllib.request
import re
import json
import html
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://www.pokemon.co.jp/shop/pokecen"

# 表示順（スタンプラリー資料の並び）
SLUGS = [
    "sapporo", "tohoku", "tokyodx", "megatokyo", "shibuya", "skytreetown",
    "tokyobay", "yokohama", "nagoya", "kanazawa", "kyoto", "osaka",
    "osakadx", "hiroshima", "kagawa", "fukuoka", "okinawa",
]

PREF_CITY = re.compile(r"(.+?[都道府県])(.+?[市区町村])")


def fetch(slug: str) -> str:
    url = f"{BASE}/{slug}/"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")


def parse(no: int, slug: str, h: str) -> dict:
    name = html.unescape(re.search(r"<h1[^>]*>([^<]+)</h1>", h).group(1).strip())
    street = html.unescape(re.search(r'"streetAddress":\s*"([^"]+)"', h).group(1))
    addr = re.sub(r"〒\d{3}-\d{4}", "", street).strip()
    lng, lat = re.search(r"!2d([0-9.]+)!3d([0-9.]+)", h).groups()
    m = PREF_CITY.match(addr)
    pref, city = (m.group(1), m.group(2)) if m else ("", "")
    return {
        "no": no, "name": name, "pref": pref, "city": city, "addr": addr,
        "lat": float(lat), "lng": float(lng), "url": f"{BASE}/{slug}/",
    }


def main() -> None:
    recs = []
    for i, slug in enumerate(SLUGS, start=1):
        try:
            recs.append(parse(i, slug, fetch(slug)))
        except Exception as e:  # noqa
            print(f"  ! {slug}: {e}", file=sys.stderr)

    # Pokémon GO Lab.（店舗ページなし・サンシャインシティ内）
    recs.append({
        "no": 18, "name": "Pokémon GO Lab.", "pref": "東京都", "city": "豊島区",
        "addr": "東京都豊島区東池袋3-1 サンシャインシティ",
        "lat": 35.729408, "lng": 139.719022,
        "url": "https://www.pokemongo.jp/",
    })

    print(f"取得件数: {len(recs)} / 18", file=sys.stderr)
    for r in recs:
        print(f"  {r['no']:2} {r['name']}  {r['pref']}{r['city']}  ({r['lat']},{r['lng']})",
              file=sys.stderr)

    data_dir = ROOT / "data"
    data_dir.mkdir(exist_ok=True)
    (data_dir / "pokecen.json").write_text(
        json.dumps(recs, ensure_ascii=False, indent=1), encoding="utf-8")
    app = ROOT / "app" / "src" / "data" / "pokecen.json"
    app.parent.mkdir(parents=True, exist_ok=True)
    app.write_text(json.dumps(recs, ensure_ascii=False, separators=(",", ":")),
                   encoding="utf-8")
    print("生成: data/pokecen.json / app/src/data/pokecen.json", file=sys.stderr)


if __name__ == "__main__":
    main()
