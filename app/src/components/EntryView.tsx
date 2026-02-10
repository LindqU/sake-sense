import React from 'react';
import { MessageSquareText, Save, CheckCircle2, Wine, Factory, LogIn, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { TongueMap } from './TongueMap';
import { IntensityTimeline } from './IntensityTimeline';

interface EntryViewProps {
    sakeName: string;
    setSakeName: (v: string) => void;
    brewery: string;
    setBrewery: (v: string) => void;
    memo: string;
    setMemo: (v: string) => void;
    markers: any[];
    setMarkers: (v: any[]) => void;
    graphPoints: any[];
    setGraphPoints: (v: any[]) => void;
    isLoading: boolean;
    isSaved: boolean;
    handleSave: () => void;
    resetForm: () => void;
    isLoggedIn: boolean;
    onLoginClick: () => void;
    isEditable: boolean;
}

export const EntryView = ({
    sakeName, setSakeName,
    brewery, setBrewery,
    memo, setMemo,
    markers, setMarkers,
    graphPoints, setGraphPoints,
    isLoading,
    isSaved,
    handleSave,
    resetForm,
    isLoggedIn,
    onLoginClick,
    isEditable = true
}: EntryViewProps) => {
    return (
        <main className="max-w-md mx-auto p-4 space-y-8 pb-32">
            <section className="space-y-4">
                <Input
                    label="Brand"
                    placeholder="銘柄名を入力..."
                    value={sakeName}
                    onChange={(e) => setSakeName(e.target.value)}
                    icon={<Wine size={18} />}
                    className="text-lg font-bold"
                    disabled={!isEditable}
                />
                <Input
                    label="Brewery"
                    placeholder="酒造名を入力..."
                    value={brewery}
                    onChange={(e) => setBrewery(e.target.value)}
                    icon={<Factory size={18} />}
                    disabled={!isEditable}
                />
            </section>

            <div className="space-y-6">
                <TongueMap
                    markers={markers}
                    onMarkersChange={setMarkers}
                    disabled={!isEditable}
                />
                <IntensityTimeline
                    points={graphPoints}
                    onPointsChange={setGraphPoints}
                    disabled={!isEditable}
                />
            </div>

            <section className="space-y-2">
                <Textarea
                    label="Notes"
                    placeholder="味わいの感想やメモ..."
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    icon={<MessageSquareText size={18} />}
                    disabled={!isEditable}
                />
            </section>

            <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/60 backdrop-blur-2xl border-t border-indigo-50 flex gap-4 z-40">
                {!isEditable ? (
                    <div className="w-full flex items-center justify-center gap-2 py-4 bg-slate-100/50 rounded-2xl text-slate-400 font-bold border border-slate-200/50">
                        <Lock size={18} />
                        <span>閲覧モード（編集不可）</span>
                    </div>
                ) : (
                    <>
                        <Button variant="outline" onClick={resetForm} className="flex-1 h-14 rounded-2xl border-slate-200">
                            Clear
                        </Button>
                        {isLoggedIn ? (
                            <Button
                                onClick={handleSave}
                                disabled={isLoading || !sakeName}
                                variant={isSaved ? "success" : "primary"}
                                className="flex-[2] h-14 rounded-2xl shadow-lg shadow-indigo-100"
                            >
                                {isSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                                {isSaved ? 'Saved!' : 'Record Tasting'}
                            </Button>
                        ) : (
                            <Button
                                onClick={onLoginClick}
                                variant="primary"
                                className="flex-[2] h-14 rounded-2xl shadow-lg shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700"
                            >
                                <LogIn className="w-5 h-5" />
                                ログインして記録する
                            </Button>
                        )}
                    </>
                )}
            </footer>
        </main>
    );
};
