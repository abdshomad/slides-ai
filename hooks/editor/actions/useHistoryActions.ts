import { useCallback } from 'react';
import { Slide as SlideType } from '../../../types/index';
import { ActionHookProps } from './types';

export const useHistoryActions = ({
    presentation, onAddCheckpoint,
    state, setters, modalSetters,
}: ActionHookProps) => {
    const { slides, currentState } = state;
    const { setSlides } = setters;
    const { setHistorySlideId } = modalSetters;

    const createCheckpoint = useCallback((action: string, stateForCheckpoint: any) => {
        onAddCheckpoint(presentation.id, action, stateForCheckpoint);
    }, [onAddCheckpoint, presentation.id]);
    
    const handleViewSlideHistory = (slideId: string) => {
        setHistorySlideId(slideId);
    };

    const handleRestoreSlideFromHistory = useCallback((slideState: SlideType) => {
        const updatedSlides = slides.map(s => s.id === slideState.id ? slideState : s);
        setSlides(updatedSlides);
        createCheckpoint(`Restored slide "${slideState.title}" from history`, { ...currentState, slides: updatedSlides });
        setHistorySlideId(null);
    }, [slides, createCheckpoint, currentState, setSlides, setHistorySlideId]);
    
    return {
        handleViewSlideHistory,
        handleRestoreSlideFromHistory,
    };
};