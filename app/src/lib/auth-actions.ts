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
