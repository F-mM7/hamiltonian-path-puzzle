# Hamiltonian Path Puzzle

5×5 グリッド上で S（スタート）から G（ゴール）まで、全マスをちょうど 1 度ずつ通る経路（ハミルトン路）を辿るパズル。謎解きトレーニング用 Web アプリ。

🔗 デモ: https://f-mm7.github.io/hamiltonian-path-puzzle/

## ルール

- 隣り合うマスへ移動できるが、太線で区切られた壁は通過できない
- S を 1 マス目として全マスを通る経路を辿り、`step` の倍数マス目に書かれた平仮名を順に拾うと答えの単語が得られる
- 解答欄に単語を入力して送信。正解時は新しい盤面が自動生成される

## 開発

```bash
npm install
npm run dev      # 開発サーバ
npm run build    # ビルド
npm run lint     # ESLint
npm run deploy   # gh-pages へデプロイ
```

## 技術スタック

React 19 / TypeScript / Vite / GitHub Pages
