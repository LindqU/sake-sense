# PR指摘事項の修正タスク

- [x] 修正の準備
    - [x] `tailwind-merge`, `clsx` のインストール
    - [x] ユーティリティ関数 `cn` の作成 (`app/src/lib/utils.ts`)
- [ ] コンポーネントの修正
    - [x] `Card` コンポーネントのクラス競合解消 (`app/src/components/ui/Card.tsx`)
    - [x] `Button` コンポーネントのクラス競合解消 (`app/src/components/ui/Button.tsx`)
- [x] フォームの修正 (`app/src/components/Login.tsx`)
    - [x] アクセシビリティ改善 (`htmlFor` と `id` の紐付け)
    - [x] フォーム切り替えボタンの `type="button"` 指定
- [x] 検証
    - [x] ログイン画面の表示と動作確認
    - [x] アクセシビリティ（id/htmlFor）の確認
