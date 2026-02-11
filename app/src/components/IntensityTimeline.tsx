import React, { useRef, useEffect, useCallback, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface Point {
    x: number;
    y: number;
}

interface IntensityTimelineProps {
    points: Point[];
    onPointsChange: (points: Point[]) => void;
    disabled?: boolean;
}

export const IntensityTimeline = ({ points, onPointsChange, disabled }: IntensityTimelineProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            ctx.beginPath(); ctx.moveTo((width / 5) * i, 0); ctx.lineTo((width / 5) * i, height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, (height / 4) * i); ctx.lineTo(width, (height / 4) * i); ctx.stroke();
        }

        if (points.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 4;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.moveTo(points[0].x, points[0].y);
            points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.stroke();
        }
    }, [points]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);

    const getCanvasCoords = (e: any) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    const handleDrawStart = (e: any) => {
        if (disabled) return;
        setIsDrawing(true);
        const pos = getCanvasCoords(e);
        onPointsChange([pos]);
    };

    const handleDrawMove = (e: any) => {
        if (!isDrawing || disabled) return;
        const pos = getCanvasCoords(e);
        const lastPoint = points[points.length - 1];
        if (lastPoint && pos.x <= lastPoint.x) return;
        onPointsChange([...points, pos]);
    };

    const handleClear = () => {
        onPointsChange([]);
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-slate-800 text-sm">Intensity Timeline</h2>
                <Button
                    variant="ghost"
                    onClick={handleClear}
                    className="p-1 h-8 w-8"
                    disabled={disabled || points.length === 0}
                >
                    <RotateCcw className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1">
                <div className="flex gap-2">
                    {/* 縦軸ラベル */}
                    <div className="flex flex-col justify-between py-1 text-[10px] font-medium text-slate-400 select-none">
                        <span>強い</span>
                        <span>弱い</span>
                    </div>

                    <div className="relative flex-1 aspect-[4/3] w-full border-2 border-slate-50 rounded-2xl bg-slate-50/30 overflow-hidden touch-none">
                        <canvas
                            ref={canvasRef}
                            width={400} height={300}
                            onMouseDown={handleDrawStart}
                            onMouseMove={handleDrawMove}
                            onMouseUp={() => setIsDrawing(false)}
                            onTouchStart={handleDrawStart}
                            onTouchMove={handleDrawMove}
                            onTouchEnd={() => setIsDrawing(false)}
                            className="w-full h-full"
                        />
                    </div>
                </div>
                {/* 横軸ラベル */}
                <div className="flex justify-between mt-2 px-1 text-[10px] font-medium text-slate-400 select-none">
                    <span>含んだ瞬間</span>
                    <span>余韻</span>
                </div>
            </div>
        </Card>
    );
};
