'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mail, Lock, UserPlus, LogIn, Loader2, Key, User } from 'lucide-react';

export const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [inviteKey, setInviteKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                if (!displayName.trim()) {
                    throw new Error('表示名を入力してください。');
                }

                // 招待コードのチェック
                const masterKey = process.env.NEXT_PUBLIC_INVITE_KEY;
                if (inviteKey !== masterKey) {
                    throw new Error('招待コードが正しくありません。');
                }

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { display_name: displayName }
                    }
                });
                console.log('SignUp Response:', { data, error });
                if (error) throw error;

                if (data.user) {
                    // プロフィールテーブルに作成
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert({
                            id: data.user.id,
                            display_name: displayName
                        });

                    if (profileError) {
                        console.error('Profile Creation Error:', profileError);
                    }

                    if (data.session) {
                        setMessage({ type: 'success', text: 'アカウント作成に成功しました。' });
                    } else {
                        setMessage({ type: 'success', text: '確認メールを送信しました。' });
                    }
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-4">
            <Card className="w-full max-w-md p-8 shadow-2xl shadow-indigo-100/50 border-white/50 backdrop-blur-sm bg-white/90">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-200 rotate-3 hover:rotate-0 transition-transform duration-300">
                        {isSignUp ? <UserPlus className="text-white w-10 h-10" /> : <LogIn className="text-white w-10 h-10" />}
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sake Sense</h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        {isSignUp ? '新しいアカウントを作成' : '日本酒テイスティングログ'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                    {isSignUp && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                User Name
                            </label>
                            <div className="relative group">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    required={isSignUp}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50/50 font-medium"
                                    placeholder="your-prow"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50/50 font-medium"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-slate-50/50 font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {isSignUp && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider ml-1">
                                Invitation Key
                            </label>
                            <div className="relative group">
                                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    value={inviteKey}
                                    onChange={(e) => setInviteKey(e.target.value)}
                                    required={isSignUp}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-indigo-50/30 font-bold placeholder:font-normal"
                                    placeholder="招待コードを入力"
                                />
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className={`p-4 rounded-2xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            } animate-in zoom-in-95 duration-200`}>
                            {message.text}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 text-lg font-bold rounded-2xl shadow-lg shadow-indigo-200 mt-4 transition-transform active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : isSignUp ? (
                            <span className="flex items-center gap-2 justify-center">
                                <UserPlus size={20} />
                                新規登録を完了する
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 justify-center">
                                <LogIn size={20} />
                                ログイン
                            </span>
                        )}
                    </Button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-100">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setMessage(null);
                        }}
                        className="text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors group"
                    >
                        {isSignUp ? (
                            <>
                                すでにアカウントをお持ちですか？ <span className="text-indigo-600 group-hover:underline">ログイン</span>
                            </>
                        ) : (
                            <>
                                はじめての方はこちら <span className="text-indigo-600 group-hover:underline">新規登録 (招待制)</span>
                            </>
                        )}
                    </button>
                </div>
            </Card>
        </div>
    );
};


