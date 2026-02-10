import React from 'react';
import { Wine, History, Plus, LogOut } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
    view: 'entry' | 'history';
    onToggleView: () => void;
    onLogout: () => void;
}

export const Header = ({ view, onToggleView, onLogout }: HeaderProps) => (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-indigo-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <Wine className="w-5 h-5" />
            </div>
            <div>
                <h1 className="font-bold text-slate-800 text-lg leading-none">Sake Sense</h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">Tasting Log</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onToggleView} className="text-slate-500 hover:bg-indigo-50 hover:text-indigo-600">
                {view === 'entry' ? (
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4" />
                        <span className="text-xs font-bold">History</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span className="text-xs font-bold">New Log</span>
                    </div>
                )}
            </Button>
            <Button variant="ghost" onClick={onLogout} className="text-slate-400 hover:bg-red-50 hover:text-red-500 p-2">
                <LogOut className="w-4 h-4" />
            </Button>
        </div>
    </header>
);
