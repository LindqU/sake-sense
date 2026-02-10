import React from 'react';
import { Undo2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface Marker {
    x: number;
    y: number;
}

interface TongueMapProps {
    markers: Marker[];
    onMarkersChange: (markers: Marker[]) => void;
    disabled?: boolean;
}

export const TongueMap = ({ markers, onMarkersChange, disabled }: TongueMapProps) => {
    const handleTongueClick = (e: React.MouseEvent) => {
        if (disabled) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 200;
        const y = ((e.clientY - rect.top) / rect.height) * 280;
        onMarkersChange([...markers, { x, y }]);
    };

    const handleUndo = () => {
        onMarkersChange(markers.slice(0, -1));
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-slate-800 text-sm">Tongue Map</h2>
                <Button
                    variant="ghost"
                    onClick={handleUndo}
                    disabled={disabled || markers.length === 0}
                    className="p-1 h-8 w-8"
                >
                    <Undo2 className="w-4 h-4" />
                </Button>
            </div>
            <div className="flex justify-center relative touch-none py-2">
                <svg
                    width="180"
                    height="250"
                    viewBox="0 0 200 280"
                    onClick={handleTongueClick}
                    className={disabled ? "" : "cursor-crosshair"}
                >
                    <path
                        d="M100 20 C40 20 20 100 20 180 C20 240 60 260 100 260 C140 260 180 240 180 180 C180 100 160 20 100 20Z"
                        fill="#fff1f2"
                        stroke="#fecdd3"
                        strokeWidth="3"
                    />
                    {markers.map((m, i) => (
                        <circle key={i} cx={m.x} cy={m.y} r="8" fill="#f43f5e" />
                    ))}
                </svg>
            </div>
        </Card>
    );
};
