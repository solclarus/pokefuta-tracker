# ポケふた チェックリスト

全国のポケモンマンホール「ポケふた」を地図で巡り、取得済みをチェックする個人用 Web アプリ。
データは公式サイト [local.pokemon.jp](https://local.pokemon.jp/manhole/) から取得。

## 構成

```
pokefuta-tracker/
├─ app/      React アプリ（Vite + React + TypeScript）
├─ data/     取得データ（canonical JSON）
└─ scripts/  データ取得・差分レポート
```

## 開発

```sh
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # 本番ビルド
```

## データ更新

```sh
python3 scripts/fetch_pokefuta.py
```

公式の個別ページを ID 順に走査するため、追加直後で検索未反映のポケふたも取得できる。
公式データが不正確なものは `fetch_pokefuta.py` の `PRESERVE` に番号を登録すると上書きされない
（例: No.448 ポケパーク カントー = 実際は東京都稲城市）。

## デプロイ / 利用

`main` への push で GitHub Pages へ自動デプロイ（`.github/workflows/deploy-pages.yml`）。
スマホは公開 URL を「ホーム画面に追加」で PWA として使える（オフライン対応）。
取得済みチェックは端末の localStorage に保存される。

## 出典

情報・画像は公式「ポケモンローカルActs」に帰属。個人利用目的。
© Pokémon. © Nintendo / Creatures Inc. / GAME FREAK inc.
