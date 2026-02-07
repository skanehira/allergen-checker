# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

高級旅館・ホテル向けの食物アレルギーチェックシステム（MVP）。仕入先情報の取込→アレルゲン正規化→レシピ紐付け→顧客アレルギーマッチング→判定リスト生成の5ステップワークフローをデジタル化する。

詳細な要件・設計は `docs/` ディレクトリ参照：
- `docs/DESIGN.md` - 要件定義・データ構造・判定ロジック
- `docs/FLOW.md` - 業務フロー図
- `docs/WIREFRAME_ASCII.md` - 5画面のワイヤーフレーム

## 技術スタック

- **React 19** + **TypeScript** (strict mode) + **Vite** (rolldown-vite)
- **TailwindCSS 4** (`@tailwindcss/vite` プラグイン経由)
- **oxlint** + **oxfmt** (リンター・フォーマッター)

## コマンド

```bash
npm run dev        # 開発サーバー起動 (http://localhost:5173)
npm run build      # TypeScript型チェック + Viteビルド
npm run preview    # ビルド済みアプリをプレビュー
npm run lint       # oxlint (--deny-warnings)
npm run fmt        # oxfmt (src/ をフォーマット)
npm run check      # fmt + lint + tsc (CI相当の全チェック)
```

## デプロイ

- GitHub Pages (`main` pushで自動デプロイ)
- Vite base path: `/allergen-checker/`

## 判定ロジック（ビジネスルール）

- 特定原材料28品目（日本基準）でマッチング
- 判定: **OK**（アレルゲン不含）/ **要確認**（不明・曖昧）/ **NG**（明確に含有）
- 不明な原材料は安全側に倒して「要確認」に自動分類
