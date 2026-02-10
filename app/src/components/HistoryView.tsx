import React from 'react';
import { ChevronRight, Calendar } from 'lucide-react';
import { Card } from './ui/Card';

interface HistoryViewProps {
    history: any[];
    onViewDetail: (log: any) => void;
}

export const HistoryView = ({ history, onViewDetail }: HistoryViewProps) => {
    return (
        <main className="max-w-md mx-auto p-4 space-y-6">
            <div className="flex justify-between items-end px-1 pt-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Logs</h2>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Tasting Journey</p>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-bold">
                    {history.length} ITEMS
                </span>
            </div>

            <div className="space-y-3">
                {history.length === 0 ? (
                    <div className="py-24 flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <Calendar size={32} />
                        </div>
                        <p className="text-slate-400 font-medium">まだ記録がありません</p>
                    </div>
                ) : (
                    history.map(log => (
                        <button
                            key={log.aggregate_id}
                            onClick={() => onViewDetail(log)}
                            className="w-full text-left transition-transform active:scale-[0.98]"
                        >
                            <Card className="p-5 flex items-center justify-between group hover:border-indigo-200 transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{log.content.brand_name}</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {log.content.brewery && (
                                            <span className="text-[10px] text-slate-500 font-medium">{log.content.brewery}</span>
                                        )}
                                        <span className="text-[10px] text-slate-300 font-medium italic">
                                            {new Date(log.created_at).toLocaleDateString('ja-JP')}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </Card>
                        </button>
                    ))
                )}
            </div>
        </main>
    );
};
