import { useCallback } from 'react';
import { generateOutlineAction } from '../../actions/outlineActions';
import { generateSlidesAction } from '../../actions/slideGenerationActions';
import { parseOutline } from '../../../utils/outlineParser';
import { ActionHookProps } from './types';

export const useOutlineActions = ({
    presentation, onAddCheckpoint, onUpdatePresentation,
    state, setters,
    managedFiles, timer, currentState
}: ActionHookProps) => {
    const { inputText, outline, tone, sources } = state;
    const { 
        setError, setIsLoading, setLoadingMessage, setOutline, setSources, setPresentationTitle, setGenerationStep,
        setSlides, setSourcedImages, setCurrentLoadingStep, setCurrentLoadingSubStep, setGenerationStats, setEstimatedTime
    } = setters;
    const { startTimer, stopTimer } = timer;
    
    const createCheckpoint = useCallback((action: string, stateForCheckpoint: any) => {
        onAddCheckpoint(presentation.id, action, stateForCheckpoint);
    }, [onAddCheckpoint, presentation.id]);

    const handleGenerateOutline = useCallback(async () => {
        setEstimatedTime(25);
        startTimer();
        try {
            await generateOutlineAction({
                inputText, managedFiles, presentation,
                setError, setIsLoading, setLoadingMessage, setOutline, setSources, setPresentationTitle, setGenerationStep,
                onUpdatePresentation, createCheckpoint, currentState
            });
        } finally {
            stopTimer();
        }
    }, [
        inputText, managedFiles, presentation, onUpdatePresentation, createCheckpoint, currentState, startTimer, stopTimer,
        setError, setIsLoading, setLoadingMessage, setOutline, setSources, setPresentationTitle, setGenerationStep, setEstimatedTime
    ]);

    const handleGenerateSlidesFromOutline = useCallback(async () => {
        const parsed = parseOutline(outline);
        const estimate = parsed.length > 0 ? parsed.length * 8 : 40;
        setEstimatedTime(estimate);
        startTimer();
        try {
            await generateSlidesAction({
                managedFiles, inputText, outline, tone, sources,
                setError, setIsLoading, setLoadingMessage, setSlides, setSourcedImages, setGenerationStep,
                setCurrentLoadingStep, setCurrentLoadingSubStep, setGenerationStats,
                createCheckpoint, currentState
            });
        } finally {
            stopTimer();
        }
    }, [
        managedFiles, inputText, outline, tone, sources, createCheckpoint, currentState, startTimer, stopTimer,
        setSlides, setSourcedImages, setGenerationStep, setError, setIsLoading, setLoadingMessage, setCurrentLoadingStep, setCurrentLoadingSubStep, setGenerationStats, setEstimatedTime
    ]);

    return {
        handleGenerateOutline,
        handleGenerateSlidesFromOutline,
    };
};