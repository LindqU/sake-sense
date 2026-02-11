'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Save, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { supabase } from '@/lib/supabase';
import { updateProfile, updatePassword } from '@/lib/auth-actions';

interface MyPageProps {
    onBack: () => void;
}

export const MyPage = ({ onBack }: MyPageProps) => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error || !user) {
                    setMessage({ type: 'error', text: 'ユーザー情報の取得に失敗しました。' });
                    // 少し待ってから戻る、あるいはユーザーの操作を待つ
                    setTimeout(() => onBack(), 2000);
                    return;
                }
                setDisplayName(user.user_metadata.display_name || '');
                setEmail(user.email || '');
            } catch (error: unknown) {
                setMessage({ type: 'error', text: '予期せぬエラーが発生しました。' });
            } finally {
                setInitialLoading(false);
            }
        };
        fetchUser();
    }, [onBack]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName.trim()) {
            setMessage({ type: 'error', text: '表示名を入力してください。' });
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            await updateProfile({ displayName });
            setMessage({ type: 'success', text: 'プロフィールを更新しました。' });
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : '更新に失敗しました。';
            setMessage({ type: 'error', text: msg });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setMessage({ type: 'error', text: 'パスワードは6文字以上で入力してください。' });
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            await updatePassword({ password });
            setMessage({ type: 'success', text: 'パスワードを更新しました。' });
            setPassword('');
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : '更新に失敗しました。';
            setMessage({ type: 'error', text: msg });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <main className="max-w-md mx-auto p-4 space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Button>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">My Page</h2>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Account Settings</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <div className="space-y-6">
                {/* プロフィール設定 */}
                <section className="bg-white rounded-[2rem] p-6 border border-indigo-50 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            <User className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800">Profile</h3>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <input
                                id="email"
                                type="text"
                                value={email}
                                disabled
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 text-sm outline-none cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="displayName" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                            <input
                                id="displayName"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your Name"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-slate-700 text-sm outline-none transition-all"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span className="font-bold">Save Profile</span>
                        </Button>
                    </form>
                </section>

                {/* セキュリティ設定 */}
                <section className="bg-white rounded-[2rem] p-6 border border-indigo-50 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-slate-50 rounded-xl text-slate-600">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800">Security</h3>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-slate-700 text-sm outline-none transition-all"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white h-14 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                            <span className="font-bold">Update Password</span>
                        </Button>
                    </form>
                </section>
            </div>
        </main>
    );
};
