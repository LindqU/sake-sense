import { useState, useCallback } from 'react';
import { TastingContent } from '@/lib/schema';
import { saveTastingEvent } from '@/lib/actions';

export const useTastingForm = (onSaveSuccess: () => void) => {
    const [aggregateId, setAggregateId] = useState<string>(crypto.randomUUID());
    const [currentVersion, setCurrentVersion] = useState(0);
    const [sakeName, setSakeName] = useState('');
    const [brewery, setBrewery] = useState('');
    const [memo, setMemo] = useState('');
    const [markers, setMarkers] = useState<{ x: number, y: number }[]>([]);
    const [graphPoints, setGraphPoints] = useState<{ x: number, y: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const resetForm = useCallback(() => {
        setAggregateId(crypto.randomUUID());
        setCurrentVersion(0);
        setSakeName('');
        setBrewery('');
        setMemo('');
        setMarkers([]);
        setGraphPoints([]);
        setIsSaved(false);
    }, []);

    const handleSave = async () => {
        if (!sakeName.trim()) return;
        setIsLoading(true);

        const content: TastingContent = {
            brand_name: sakeName,
            brewery: brewery,
            memo: memo,
            tongue_map: markers,
            time_intensity: graphPoints
        };

        try {
            const result = await saveTastingEvent(aggregateId, content, currentVersion);
            setCurrentVersion(result.version);
            setIsSaved(true);
            setTimeout(() => {
                setIsSaved(false);
                resetForm();
                onSaveSuccess();
            }, 800);
        } catch (e: any) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const loadFromLog = useCallback((log: any) => {
        setAggregateId(log.aggregate_id);
        setCurrentVersion(log.version);
        setSakeName(log.content.brand_name);
        setBrewery(log.content.brewery || '');
        setMemo(log.content.memo || '');
        setMarkers(log.content.tongue_map || []);
        setGraphPoints(log.content.time_intensity || []);
        setIsSaved(false);
    }, []);

    return {
        sakeName, setSakeName,
        brewery, setBrewery,
        memo, setMemo,
        markers, setMarkers,
        graphPoints, setGraphPoints,
        isLoading,
        isSaved,
        handleSave,
        resetForm,
        loadFromLog
    };
};
