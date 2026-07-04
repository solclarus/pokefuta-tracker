#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PWA アイコン生成（依存なし・zlib のみ）。
ポケふた = ポケボール風マンホールのアイコンを PNG で出力する。"""
import zlib, struct, math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "app" / "public"
OUT.mkdir(parents=True, exist_ok=True)

BRAND = (255, 84, 112)      # ピンク（上半分）
CREAM = (247, 248, 250)     # 下半分
INK = (28, 33, 45)          # 縁・帯
BG = (18, 20, 29)           # maskable の背景


def png(size, pixel):
    raw = bytearray()
    for y in range(size):
        raw.append(0)  # filter type 0
        for x in range(size):
            raw += bytes(pixel(x, y, size))
    comp = zlib.compress(bytes(raw), 9)

    def chunk(tag, data):
        c = tag + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)  # RGBA
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", comp) + chunk(b"IEND", b"")


def ball_pixel(x, y, size, R_ratio, bg):
    cx = cy = size / 2
    R = size * R_ratio
    dx, dy = x - cx, y - cy
    d = math.hypot(dx, dy)
    band = R * 0.13
    btn_out = R * 0.24
    btn_in = R * 0.15
    if d > R:
        return bg
    if d >= R * 0.85:          # 外縁
        return (*INK, 255)
    if abs(dy) <= band:        # 中央の帯
        if d <= btn_out and d >= btn_in:
            return (*INK, 255)
        if d < btn_in:
            return (*CREAM, 255)
        return (*INK, 255)
    if d <= btn_out:           # 中央ボタン周り（帯の外側）
        if d >= btn_in:
            return (*INK, 255)
        return (*CREAM, 255)
    return (*BRAND, 255) if dy < 0 else (*CREAM, 255)


def make(name, size, R_ratio=0.46, bg=(0, 0, 0, 0)):
    data = png(size, lambda x, y, s: ball_pixel(x, y, s, R_ratio, bg))
    (OUT / name).write_bytes(data)
    print("wrote", name, size)


make("pwa-192x192.png", 192)
make("pwa-512x512.png", 512)
make("apple-touch-icon.png", 180, R_ratio=0.44, bg=(*BG, 255))       # apple は角丸なし・不透明
make("maskable-512x512.png", 512, R_ratio=0.34, bg=(*BG, 255))       # セーフゾーン考慮で小さめ＋背景
make("favicon.png", 64)
