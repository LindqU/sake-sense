import { createClient } from '@supabase/supabase-js';

// 環境変数の存在確認（ランタイムエラーを未然に防ぐ）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing env variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined.'
    );
}

/**
 * Supabase Client Instance
 * アプリケーション全体でこのインスタンスを共有して使用します。
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);