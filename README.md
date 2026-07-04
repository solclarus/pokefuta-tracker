# ポケふた チェックリスト

全国のポケモンマンホール「ポケふた」を地図で巡り、取得済みをチェックできる個人用 Web アプリ。データは公式サイト [local.pokemon.jp](https://local.pokemon.jp/manhole/) から取得。

## 構成

```
pokefuta/
├─ app/                   React アプリ本体（Vite + React + TypeScript）
│  ├─ public/                 PWA アイコン
│  └─ src/
│     ├─ components/          UI コンポーネント
│     └─ data/pokefuta.json   アプリが読む全件データ（bundle 用）
├─ data/                  生成データ
│  ├─ pokefuta.json           全項目の生データ（canonical）
│  └─ pokefuta.csv            Google マイマップ取込用（UTF-8 BOM）
└─ scripts/
   ├─ fetch_pokefuta.py       公式サイトから全件取得し各成果物を生成
   └─ make_icons.py           PWA アイコン生成（依存なし）
```

## アプリの起動

```sh
cd app
npm install      # 初回のみ
npm run dev      # http://localhost:5173
npm run build    # 本番ビルド（dist/）
```

### 機能
- Leaflet 地図にポケふた画像のピンを表示（密集地はクラスタ表示）
- ピンをタップで詳細（画像・ポケモン・地図/公式リンク）
- 取得済みチェック（ブラウザの localStorage に保存）
- 進捗バー、都道府県・地方ごとの達成率（📊）
- 検索、全て/未取得/取得済フィルタ、ダーク/ライトのテーマ切替
- 地図／リスト表示の切替・現在地表示（フローティングボタン）
- レスポンシブ対応（モバイル=ボトムシート、PC=サイドパネル）

### PWA（オフライン対応）
ホーム画面に追加でき、地図タイル・ポケふた画像・データをキャッシュしてオフラインでも動作する。
Service Worker は本番ビルドで有効なため、動作確認は以下で行う。

```sh
npm run build && npm run preview
```

アイコンは `scripts/make_icons.py`（依存なし）で生成し `app/public/` に出力している。

## データ更新

新しいポケふたが追加されたら、以下を実行するだけで全成果物（`data/` と アプリ用 JSON）が更新される。

```sh
python3 scripts/fetch_pokefuta.py
```

公式の個別ページ（`/manhole/desc/{id}/`）を ID 順に走査するため、追加されたばかりで
検索に未反映のポケふたも確実に取得できる。

### 手動修正の保持

公式データが不正確なポケふたは、`fetch_pokefuta.py` の `PRESERVE`（manhole 番号の集合）に
登録すると、再取得時に既存の `data/pokefuta.json` の値をそのまま引き継ぎ、上書きしない。

- No.448 ポケパーク カントー … 公式は市区町村が施設名だが、実際の所在地は東京都稲城市。

## 公開（GitHub Pages）

`.github/workflows/deploy-pages.yml` が main への push 時（およびデータ自動更新の完了時）に
ビルドして GitHub Pages へデプロイする。URL は `https://<ユーザー名>.github.io/<リポジトリ名>/`。

初回のみ:

1. GitHub にリポジトリを push（無料プランで Pages を使うなら public リポジトリ）
2. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定
3. Actions が完了すると公開される

スマホでの利用（PWA としてホーム画面へ追加）:

- iPhone (Safari): 公開 URL を開く → 共有 → 「ホーム画面に追加」
- Android (Chrome): メニュー → 「アプリをインストール」

> 取得済みチェックは各端末のブラウザ（localStorage）に保存されるため、サイトが公開でも
> チェック内容は自分の端末内で完結する。

## Google マップへの取込

`data/pokefuta.csv` を [Google マイマップ](https://mymaps.google.com) にインポート →
位置情報の列に `latitude` / `longitude`、マーカー名に `name` を指定。

## データ出典

ポケふたの情報・画像は公式サイト「ポケモンローカルActs」に帰属。本アプリは個人利用目的。
© Pokémon. © Nintendo / Creatures Inc. / GAME FREAK inc.
