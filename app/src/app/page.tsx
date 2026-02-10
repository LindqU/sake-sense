'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchAllLatestLogs } from '@/lib/actions';
import { useTastingForm } from '@/hooks/useTastingForm';
import { Header } from '@/components/Header';
import { EntryView } from '@/components/EntryView';
import { HistoryView } from '@/components/HistoryView';
import { Login } from '@/components/Login';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState<'entry' | 'history'>('entry');
  const [showLogin, setShowLogin] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedLogUserId, setSelectedLogUserId] = useState<string | null>(null);

  // 認証状態の監視
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
      if (session) setShowLogin(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 履歴の取得
  const loadHistory = useCallback(async () => {
    try {
      const logs = await fetchAllLatestLogs();
      setHistory(logs);
    } catch (e) {
      console.error('履歴取得失敗:', e);
    }
  }, []);

  const onSaveSuccess = useCallback(() => {
    loadHistory();
    setView('history');
  }, [loadHistory]);

  const form = useTastingForm(onSaveSuccess);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const toggleView = () => {
    if (view === 'entry') {
      setView('history');
    } else {
      // New Log
      form.resetForm();
      setSelectedLogUserId(null);
      setView('entry');
    }
  };

  const viewDetail = (log: any) => {
    form.loadFromLog(log);
    setSelectedLogUserId(log.user_id);
    setView('entry');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (showLogin && !session) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-4 left-4 z-50 p-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          ← 戻る
        </button>
        <Login />
      </div>
    );
  }

  // 編集可能かどうかの判定: 
  // 1. 新規作成時 (selectedLogUserId が null) 
  // 2. 作成者本人である時 (session.user.id === selectedLogUserId)
  const isEditable = !selectedLogUserId || (session?.user?.id === selectedLogUserId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      <Header
        view={view}
        onToggleView={toggleView}
        onLogout={handleLogout}
        isLoggedIn={!!session}
        onLoginClick={() => setShowLogin(true)}
      />

      {view === 'entry' ? (
        <EntryView
          {...form}
          isLoggedIn={!!session}
          onLoginClick={() => setShowLogin(true)}
          isEditable={isEditable}
        />
      ) : (
        <HistoryView
          history={history}
          onViewDetail={viewDetail}
        />
      )}
    </div>
  );
}