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
  const [history, setHistory] = useState<any[]>([]);

  // 認証状態の監視
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 履歴の取得
  const loadHistory = useCallback(async () => {
    if (!session) return;
    try {
      const logs = await fetchAllLatestLogs();
      setHistory(logs);
    } catch (e) {
      console.error('履歴取得失敗:', e);
    }
  }, [session]);

  const onSaveSuccess = useCallback(() => {
    loadHistory();
    setView('history');
  }, [loadHistory]);

  const form = useTastingForm(onSaveSuccess);

  useEffect(() => {
    if (view === 'history' && session) loadHistory();
  }, [view, loadHistory, session]);

  const toggleView = () => {
    setView(prev => prev === 'entry' ? 'history' : 'entry');
  };

  const viewDetail = (log: any) => {
    form.loadFromLog(log);
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

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      <Header
        view={view}
        onToggleView={toggleView}
        onLogout={handleLogout}
      />

      {view === 'entry' ? (
        <EntryView
          {...form}
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