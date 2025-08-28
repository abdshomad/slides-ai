import { useState, useEffect } from 'react';
// FIX: Correct import path for types
import { PresentationProject, AppState } from '../types/index';

interface UseAutoSaveProps {
    presentation: PresentationProject;
    currentState: AppState;
    isLoading: boolean;
    onUpdatePresentation: (id: string, updates: Partial<PresentationProject>) => void;
}

type AutoSaveStatus = 'idle' | 'saving' | 'saved';

const useAutoSave = ({ presentation, currentState, isLoading, onUpdatePresentation }: UseAutoSaveProps): AutoSaveStatus => {
    const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle');

    useEffect(() => {
        if (isLoading || presentation.history.length === 0) {
            return;
        }
        
        const latestHistoryState = presentation.history[presentation.history.length - 1].state;
        // Only trigger save if the state has actually changed
        if (JSON.stringify(currentState) === JSON.stringify(latestHistoryState)) {
             if (autoSaveStatus === 'saving') {
                 setAutoSaveStatus('saved');
                 const resetHandler = setTimeout(() => setAutoSaveStatus('idle'), 2000);
                 return () => clearTimeout(resetHandler);
             }
            return;
        }

        setAutoSaveStatus('saving');
        const handler = setTimeout(() => {
            // Create a new history array with the last checkpoint's state updated.
            // This prevents adding a new checkpoint for every minor change.
            const updatedHistory = [
                ...presentation.history.slice(0, -1),
                { ...presentation.history[presentation.history.length - 1], state: currentState }
            ];
            onUpdatePresentation(presentation.id, { history: updatedHistory });
            setAutoSaveStatus('saved');
            const resetHandler = setTimeout(() => setAutoSaveStatus('idle'), 2000);
            return () => clearTimeout(resetHandler);
        }, 1500); // Debounce time for auto-saving

        return () => clearTimeout(handler);
    }, [currentState, presentation, onUpdatePresentation, isLoading, autoSaveStatus]);


    return autoSaveStatus;
};

export default useAutoSave;