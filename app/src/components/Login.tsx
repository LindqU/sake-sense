'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { signUpWithInvite } from '@/lib/auth-actions';
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

                // 招待コードのチェックはサーバーサイドで行うため、ここでは入力確認のみ
                if (!inviteKey.trim()) {
                    throw new Error('招待コードを入力してください。');
                }

                const result = await signUpWithInvite({
                    email,
                    password,
                    displayName,
                    inviteKey
                });
                console.log('SignUp Response:', result);

                if (result.user) {
                    if (result.session) {
                        await supabase.auth.setSession(result.session);
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
        <div className="flex items-center justify-center min-h-screen bg-[#05051a] relative overflow-hidden p-4">
            {/* Background elements for depth */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-800/20 rounded-full blur-[120px]" />

            <Card className="w-full max-w-md p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/10 backdrop-blur-xl bg-white/5 relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20 rotate-3 hover:rotate-0 transition-all duration-500 group">
                        {isSignUp ? (
                            <UserPlus className="text-white w-10 h-10 group-hover:scale-110 transition-transform" />
                        ) : (
                            <LogIn className="text-white w-10 h-10 group-hover:translate-x-1 transition-transform" />
                        )}
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Sake Sense</h1>
                    <div className="h-1 w-12 bg-indigo-500 rounded-full mb-4"></div>
                    <p className="text-indigo-100/70 font-medium text-center">
                        {isSignUp ? '新しいアカウントを作成して、あなたの利き酒ログを始めましょう' : '至高の日本酒体験を記録する'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    {isSignUp && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                            <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] ml-1">
                                User Name
                            </label>
                            <div className="relative group">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    required={isSignUp}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all bg-white/5 text-white placeholder:text-slate-500 font-medium"
                                    placeholder="表示名（例：sake_lover）"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all bg-white/5 text-white placeholder:text-slate-500 font-medium"
                                placeholder="mail@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all bg-white/5 text-white placeholder:text-slate-500 font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {isSignUp && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-6 duration-700">
                            <label className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] ml-1">
                                Invitation Key
                            </label>
                            <div className="relative group">
                                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/50 group-focus-within:text-amber-400 transition-colors" />
                                <input
                                    type="text"
                                    value={inviteKey}
                                    onChange={(e) => setInviteKey(e.target.value)}
                                    required={isSignUp}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-amber-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all bg-amber-500/5 text-amber-50 placeholder:text-amber-900/50 font-bold tracking-widest"
                                    placeholder="招待コードを入力"
                                />
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className={`p-4 rounded-2xl text-sm font-bold border ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            } animate-in zoom-in-95 duration-200`}>
                            {message.text}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 text-lg font-black rounded-2xl shadow-xl shadow-indigo-500/20 mt-4 transition-all active:scale-[0.98] bg-indigo-600 hover:bg-indigo-500 text-white border-b-4 border-indigo-800 hover:border-indigo-700"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : isSignUp ? (
                            <span className="flex items-center gap-2 justify-center">
                                <UserPlus size={22} />
                                アカウントを作成
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 justify-center">
                                <LogIn size={22} />
                                ログイン
                            </span>
                        )}
                    </Button>
                </form>

                <div className="mt-10 text-center pt-8 border-t border-white/5">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setMessage(null);
                        }}
                        className="text-indigo-200/50 hover:text-white font-bold text-sm transition-all group flex items-center justify-center gap-2 mx-auto"
                    >
                        {isSignUp ? (
                            <>
                                すでにアカウントをお持ちですか？ <span className="text-indigo-400 group-hover:text-indigo-300 underline decoration-indigo-400/30 underline-offset-4">ログイン</span>
                            </>
                        ) : (
                            <>
                                初めてのご利用ですか？ <span className="text-indigo-400 group-hover:text-indigo-300 underline decoration-indigo-400/30 underline-offset-4">新規登録はこちら</span>
                            </>
                        )}
                    </button>
                </div>
            </Card>
        </div>
    );
};


