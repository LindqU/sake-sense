-- 1. ユーザープロフィールテーブル (表示名用)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. テーブル作成 (tasting_events)
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

-- 3. インデックス作成
CREATE INDEX IF NOT EXISTS idx_tasting_events_aggregate_id ON tasting_events(aggregate_id);
CREATE INDEX IF NOT EXISTS idx_tasting_events_user_id ON tasting_events(user_id);

-- 4. 最新のログを取得するためのビュー (ユーザー名を含む)
CREATE OR REPLACE VIEW latest_tasting_logs AS
SELECT DISTINCT ON (e.aggregate_id)
    e.aggregate_id,
    e.payload,
    e.version,
    e.created_at,
    e.user_id,
    p.display_name as author_name
FROM tasting_events e
LEFT JOIN profiles p ON e.user_id = p.id
ORDER BY e.aggregate_id, e.version DESC;

-- 5. RLS (Row Level Security) の設定
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasting_events ENABLE ROW LEVEL SECURITY;

-- プロフィール用ポリシー
DO $$ BEGIN
    DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
END $$;

CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- イベント用ポリシーの再設定
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public read access" ON tasting_events;
    DROP POLICY IF EXISTS "Allow authenticated insert" ON tasting_events;
    DROP POLICY IF EXISTS "Allow individual update and delete" ON tasting_events;
END $$;

CREATE POLICY "Allow public read access" ON tasting_events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON tasting_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow individual update and delete" ON tasting_events FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. 権限設定
GRANT SELECT ON profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON tasting_events TO anon, authenticated;
GRANT SELECT ON latest_tasting_logs TO anon, authenticated;
GRANT INSERT, UPDATE ON tasting_events TO authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;