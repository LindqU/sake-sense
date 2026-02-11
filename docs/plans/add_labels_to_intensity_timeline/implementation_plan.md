# Intensity Timeline ラベル追加 実装計画

Intensity Timeline（味の強弱のタイムライン）に、ユーザーがグラフの意味を理解しやすくするための軸ラベルを追加します。

## 変更内容

### [IntensityTimeline コンポーネント]

#### [MODIFY] [IntensityTimeline.tsx](file:///home/lindq/develop/sake-sense/app/src/components/IntensityTimeline.tsx)

- グラフ（Canvas）の左側に縦軸ラベル（強・弱）を追加します。
- グラフ（Canvas）の下側に横軸ラベル（含んだ瞬間・余韻）を追加します。
- ラベル配置のためにコンポーネントのレイアウトを Flexbox で調整します。
- ラベルのスタイルは、既存の UI と調和するように `slate-400` などの色と小さめのフォントサイズ（`text-xs` または `text-[10px]`）を使用します。

## 検証計画

### 自動テスト
- （特に無し。UIの変更のため目視確認を主とする）

### 手動確認
- ブラウザで Intensity Timeline を表示し、ラベルが適切な位置に配置されているか確認する。
- レスポンシブ表示でラベルが崩れないか確認する。
- ラベルの文言が適切か確認する。
  - 縦軸：上「強い」、下「弱い」
  - 横軸：左「含んだ瞬間」、右「余韻」
