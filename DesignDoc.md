# **Sake Sense プロジェクトマスタードキュメント (v1.1)**

## **1\. 概念・要件定義 (Product Requirements)**

### **1.1 サービス概要**

日本酒の味わいを、言語化（メモ）だけでなく、感覚的（舌マップ）および動的（時系列グラフ）に記録・可視化する自分専用のテイスティングログ。将来的に「食」との相関分析を行うためのデータ基盤とする。

### **1.2 主要機能**

* **銘柄基本情報入力**: 銘柄名、酒造名。  
* **味覚ポジションマッピング (舌マップ)**: 舌の模式図上の任意位置をプロット。  
* **味覚時系列グラフ (Time-Intensity)**: 時間軸に沿った強弱描画。  
* **自由記述メモ**: 香り、感想などのテキスト入力。  
* **履歴表示**: Supabaseから最新のイベントログを取得し、スナップショットとして表示。

## **2\. アーキテクチャ・技術スタック (Technical Stack)**

### **2.1 技術決定 (Key Decisions)**

* **Frontend/Backend**: Next.js (App Router / TypeScript)  
* **Database**: Supabase (Auth, PostgreSQL)  
* **Design Pattern**: **Event Sourcing**  
  * すべての投稿・変更は tasting\_events テーブルに「事実（Event）」として蓄積。  
  * 表示時は最新のイベントをリダクションして表示する。  
* **Authentication**: Supabase Auth (Email/Password)  
  * 未認証時は Login コンポーネントを強制表示するガード機能を実装。

### **2.2 ディレクトリ構造**

sake-sense/  
├── infra/                 \# インフラ・DB定義（非ソースコード）  
│   └── db/schema.sql      \# Supabase用SQLスクリプト  
└── app/                   \# アプリケーション（Next.jsプロジェクト）  
    └── src/  
        ├── app/           \# Router, globals.css  
        ├── components/    \# Login.tsx, TongueMap.tsx, IntensityGraph.tsx  
        ├── lib/           \# supabase.ts (SDK), types.ts (型定義)  
        └── hooks/         \# useAuth.ts (認証状態管理)

## **3\. データモデル・型定義 (Data Schema)**

### **3.1 データベース定義 (PostgreSQL)**

\-- tasting\_events: すべての記録を保持するコアテーブル  
CREATE TABLE tasting\_events (  
    id uuid DEFAULT gen\_random\_uuid() PRIMARY KEY,  
    aggregate\_id uuid NOT NULL,          \-- 1回の試飲ログに付与する不変ID  
    user\_id uuid REFERENCES auth.users(id),  
    event\_type text NOT NULL,            \-- 'LOG\_CREATED', 'LOG\_UPDATED'  
    payload jsonb NOT NULL,              \-- 実際のデータ (詳細は型定義参照)  
    version int4 NOT NULL,               \-- 同一aggregate\_id内での連番  
    created\_at timestamptz DEFAULT now(),  
    UNIQUE (aggregate\_id, version)  
);

### **3.2 TypeScript 型定義 (lib/types.ts)**

export type TastingEventPayload \= {  
  sakeName: string;  
  brewery?: string;  
  memo: string;  
  markers: { x: number; y: number }\[\];  
  graphPoints: { x: number; y: number }\[\];  
  tastedAt: string;  
};

## **4\. 実装ロードマップ (Roadmap)**

### **フェーズ 1: プロトタイプ (Done)**

* \[x\] UI/UXデザイン確定  
* \[x\] LocalStorage版の実装

### **フェーズ 2: Supabase / Event Sourcing 基盤 (Done)**

* \[x\] Supabase プロジェクトセットアップ  
* \[x\] ディレクトリ構造整理 (app/src 構成)  
* \[x\] Supabase SDK 初期化 (lib/supabase.ts)  
* \[x\] 認証コンポーネント作成 (components/Login.tsx)  
* \[x\] **認証ガードの実装**: page.tsx でログイン状態をチェック。  
* \[x\] **保存処理のEvent Sourcing化**: データを tasting\_events に insert するよう変更。  
* \[x\] **履歴取得ロジックの変更**: Supabaseからデータをフェッチして表示。

### **フェーズ 3: デプロイ・公開準備 (Current)**

* \[x\] **Vercel へのデプロイ**  
  * \[x\] GitHub リポジトリ連携  
  * \[x\] Vercel Environment Variables の設定 (SUPABASE\_URL, ANON\_KEY)  
  * \[x\] デプロイ後の動作確認  
* \[ \] 知人招待用の簡易シークレットキー検証の導入（URLクエリパラメータ等）  
* \[ \] サイトタイトルの設定とメタデータの最適化

### **フェーズ 4: 拡張 (Next)**

* \[ \] Zod によるバリデーション  
* \[ \] 履歴の削除・編集機能（追加イベントの投入）  
* \[ \] 画像アップロード機能（ラベル写真保存用）

## **5\. 運用設計**

* **セキュリティ**: Supabase RLS (Row Level Security) により、自分のデータ以外は読み書き不可。  
* **拡張性**: ペアリング機能追加時は event\_type: 'PAIRING\_ADDED' として新しいイベントを定義する。