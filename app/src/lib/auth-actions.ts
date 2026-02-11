'use server';

import { supabase } from './supabase';

export async function signUpWithInvite(formData: {
    email: string;
    password: string;
    displayName: string;
    inviteKey: string;
}) {
    const { email, password, displayName, inviteKey } = formData;

    // サーバーサイドで環境変数をチェック（クライアントには公開されない）
    const masterKey = process.env.INVITE_KEY;

    if (!masterKey) {
        console.error('INVITE_KEY is not set in environment variables');
        throw new Error('サーバー設定エラー：招待コードが設定されていません。');
    }

    if (inviteKey !== masterKey) {
        throw new Error('招待コードが正しくありません。');
    }

    // サーバーサイドからサインアップを実行
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { display_name: displayName }
        }
    });

    if (error) throw error;

    return { user: data.user, session: data.session };
}

export async function updateProfile(formData: { displayName: string }) {
    const { displayName } = formData;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('ユーザーが見つかりません');

    // Auth.users のメタデータを更新
    const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { display_name: displayName }
    });
    if (updateAuthError) throw updateAuthError;

    // profiles テーブルを更新
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id);

    if (profileError) throw profileError;

    return { success: true };
}

export async function updatePassword(formData: { password: string }) {
    const { password } = formData;

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) throw error;

    return { success: true };
}
