import { supabase } from './supabase';
import { TastingContent, TastingContentSchema } from './schema';

/**
 * 最新のテイスティングログ断面を取得する
 * @param aggregateId ログの一意なID
 */
export async function fetchLatestTastingLog(aggregateId: string) {
    const { data, error } = await supabase
        .from('tasting_events')
        .select('payload, version')
        .eq('aggregate_id', aggregateId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 は結果が0件の場合
        console.error('Fetch error:', error);
        throw new Error('データの取得に失敗しました');
    }

    return data ? {
        content: data.payload as TastingContent,
        version: data.version
    } : null;
}

/**
 * 履歴一覧（各aggregate_idの最新版）を取得する
 */
export async function fetchAllLatestLogs() {
    const { data, error } = await supabase
        .from('latest_tasting_logs') // 作成したViewを利用
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Fetch list error detailed:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
        throw new Error(`履歴の取得に失敗しました: ${error.message} (${error.code})`);
    }

    return data.map(item => ({
        aggregate_id: item.aggregate_id,
        content: item.payload as TastingContent,
        version: item.version,
        created_at: item.created_at,
        user_id: item.user_id,
        author_name: item.author_name
    }));
}

/**
 * 新しいイベントを記録する（楽観的ロック機能付き）
 */
export async function saveTastingEvent(
    aggregateId: string,
    content: TastingContent,
    currentVersion: number = 0
) {
    // ログインユーザーの取得
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('認証セッションが見つかりません');
    const userId = session.user.id;

    // バリデーション実行
    console.log('Validating content for user:', userId);
    const validatedContent = TastingContentSchema.parse(content);

    const nextVersion = currentVersion + 1;
    const eventType = currentVersion === 0 ? 'RECORDED' : 'UPDATED';

    console.log('Inserting event:', { aggregateId, eventType, nextVersion, userId });
    const { error } = await supabase
        .from('tasting_events')
        .insert({
            aggregate_id: aggregateId,
            event_type: eventType,
            payload: validatedContent,
            version: nextVersion,
            user_id: userId, // 明示的にセット
        });

    if (error) {
        console.error('Full Supabase Error:', error);
        if (error.code === '23505') { // Unique constraint violation
            throw new Error('他の端末で更新されています。最新のデータを読み込み直してください。');
        }
        throw new Error(`保存に失敗しました: ${error.message} (${error.code})`);
    }

    return { version: nextVersion };
}