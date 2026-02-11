# 実装計画 - マイページ機能

ユーザーが自身のプロフィール（表示名）やパスワードを更新できるマイページ機能を実装します。

## ユーザーレビューが必要な項目
- **表示名の変更**: プロフィール名を変更すると、過去の全投稿の「投稿者名」も一括で変更されます（ビュー `latest_tasting_logs` を介しているため）。
- **パスワード変更**: 更新後、セッションが維持されるか、再ログインが必要になるかを確認します（Supabaseのデフォルト挙動）。

## 変更内容

### [Backend/Logic]

#### [MODIFY] [auth-actions.ts](app/src/lib/auth-actions.ts)
- `updateProfile`: `display_name` を `auth.updateUser` で更新し、かつ `profiles` テーブルの該当レコードも更新する処理を追加します。
- `updatePassword`: 新しいパスワードを設定する処理を追加します。

### [Frontend/UI]

#### [NEW] [MyPage.tsx](app/src/components/MyPage.tsx)
- 現在のユーザー情報を取得・表示。
- 名前編集モードと保存処理。
- パスワード変更セクション。
- 戻るボタン（メイン画面へ）。

#### [MODIFY] [Header.tsx](app/src/components/Header.tsx)
- ログイン中のみ表示される「ユーザー設定（マイページ）」アイコンを追加。
- アイコンクリック時に `onViewChange('mypage')` (新規追加のprop) を呼び出すように変更。

#### [MODIFY] [page.tsx](app/src/app/page.tsx)
- `view` ステートに `'mypage'` を追加。
- `Header` からの遷移ハンドリング。
- `view === 'mypage'` の場合に `MyPage` コンポーネントをレンダリング。

## 検証プラン

### 自動テスト / 手動検証
- [ ] マイページを開けることを確認。
- [ ] 名前の変更を行い、履歴一覧の「投稿者名」が変わっていることを確認。
- [ ] パスワードを変更し、一度ログアウトしてから新パスワードでログインできることを確認。
- [ ] 名前を空にして保存しようとした際にエラーが表示されることを確認。


