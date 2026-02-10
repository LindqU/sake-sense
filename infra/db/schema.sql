-- ==========================================================
-- Sake Sense: Database Schema (Supabase / PostgreSQL)
-- ==========================================================

-- 1. テーブル作成 (tasting_events)
-- Event Sourcing形式で全ての操作をイベントログとして保存
CREATE TABLE IF NOT EXISTS tasting_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_id UUID NOT NULL,          -- 1つの試飲ログを識別するID
    event_type TEXT NOT NULL,            -- 'RECORDED', 'UPDATED', 'DELETED'
    payload JSONB,                       -- ログの全データ（削除時はNULL）
    version INT NOT NULL,                -- 順序管理用（1, 2, 3...）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID DEFAULT auth.uid(),    -- ユーザーごとのフィルタリング用
    UNIQUE(aggregate_id, version)
);

-- 2. インデックス作成
CREATE INDEX IF NOT EXISTS idx_tasting_events_aggregate_id ON tasting_events(aggregate_id);
CREATE INDEX IF NOT EXISTS idx_tasting_events_user_id ON tasting_events(user_id);

-- 3. 最新のログを取得するためのビュー
-- 各 aggregate_id に対して最新（versionが最大）のレコードを抽出
CREATE OR REPLACE VIEW latest_tasting_logs AS
SELECT DISTINCT ON (aggregate_id)
    aggregate_id,
    payload,
    version,
    created_at,
    user_id
FROM tasting_events
ORDER BY aggregate_id, version DESC;

-- 4. RLS (Row Level Security) の設定
ALTER TABLE tasting_events ENABLE ROW LEVEL SECURITY;

-- 既存ポリシーのクリーンアップ（冪等性のための処理）
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can insert their own events" ON tasting_events;
    DROP POLICY IF EXISTS "Users can select their own events" ON tasting_events;
    DROP POLICY IF EXISTS "Users can update their own events" ON tasting_events;
    DROP POLICY IF EXISTS "Users can only see their own events" ON tasting_events;
END $$;

-- データの挿入（INSERT）用ポリシー
CREATE POLICY "Users can insert their own events" ON tasting_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- データの参照（SELECT）用ポリシー
CREATE POLICY "Users can select their own events" ON tasting_events
    FOR SELECT USING (auth.uid() = user_id);

-- データの更新（UPDATE）用ポリシー
CREATE POLICY "Users can update their own events" ON tasting_events
    FOR UPDATE USING (auth.uid() = user_id);

-- 5. 権限設定 (Viewに対する権限付与)
GRANT SELECT ON latest_tasting_logs TO authenticated;
GRANT SELECT ON latest_tasting_logs TO anon;