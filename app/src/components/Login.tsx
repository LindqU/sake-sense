'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mail, Lock, UserPlus, LogIn, Loader2 } from 'lucide-react';

export const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                console.log('SignUp Response:', { data, error });
                if (error) throw error;

                // メール確認がオフ設定の場合、すぐにセッションが作成される
                if (data.session) {
                    setMessage({ type: 'success', text: 'アカウント作成に成功しました。' });
                } else {
                    setMessage({ type: 'success', text: '確認メールを送信しました。' });
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                console.log('SignIn Response:', { data, error });
                if (error) throw error;
            }
        } catch (error: any) {
            console.error('Auth Error:', error);
            setMessage({ type: 'error', text: error.message || '認証に失敗しました。' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4">
            <Card className="w-full max-w-md p-8 shadow-xl border-indigo-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
                        <LogIn className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Sake Sense</h1>
                    <p className="text-slate-500 mt-1">日本酒テイスティングログ</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Mail size={16} className="text-indigo-500" />
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50"
                            placeholder="example@sensesake.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Lock size={16} className="text-indigo-500" />
                            パスワード
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50"
                            placeholder="••••••••"
                        />
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 text-lg mt-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : isSignUp ? (
                            <>新規登録</>
                        ) : (
                            <>ログイン</>
                        )}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
                    >
                        {isSignUp ? (
                            <>アカウントをお持ちの方はこちら (ログイン)</>
                        ) : (
                            <>はじめての方はこちら (新規登録)</>
                        )}
                    </button>
                </div>
            </Card>
        </div>
    );
};
