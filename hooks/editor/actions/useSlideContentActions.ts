import { useCallback } from 'react';
import { 
    generateNotesAction,
    generateTakeawayAction,
    expandSlideAction,
    factCheckSlideAction,
    adaptAudienceAction
} from '../../actions/contentActions';
import { ActionHookProps } from './types';

export const useSlideContentActions = ({
    presentation, onAddCheckpoint,
    state, setters, modalState, modalSetters
}: ActionHookProps) => {
    const { slides, currentState } = state;
    const { setError, setSlides, setFactCheckResult } = setters;
    const { factCheckResult, adaptingAudienceSlideId } = modalState;
    const { setAdaptingAudienceSlideId } = modalSetters;

    const createCheckpoint = useCallback((action: string, stateForCheckpoint: any) => {
        onAddCheckpoint(presentation.id, action, stateForCheckpoint);
    }, [onAddCheckpoint, presentation.id]);

    const handleGenerateSpeakerNotesForSlide = useCallback(
        (slideId: string) => generateNotesAction({
            slideId, slides, setError, setSlides, createCheckpoint, currentState
        }), [slides, createCheckpoint, currentState, setError, setSlides]
    );

    const handleGenerateKeyTakeaway = useCallback(
        (slideId: string) => generateTakeawayAction({
            slideId, slides, setError, setSlides, createCheckpoint, currentState
        }), [slides, createCheckpoint, currentState, setError, setSlides]
    );

    const handleExpandSlide = useCallback((slideId: string) => {
        expandSlideAction({
            slideId, slides, setError, setSlides, createCheckpoint, currentState
        });
    }, [slides, createCheckpoint, currentState, setError, setSlides]);

    const handleFactCheckSlide = useCallback(
        (slideId: string) => factCheckSlideAction({
            slideId, slides, setError, setSlides, setFactCheckResult,
        }), [slides, setError, setSlides, setFactCheckResult]
    );

    const handleCloseFactCheck = () => {
        setFactCheckResult(null);
    };

    const handleApplyFactCheck = useCallback(() => {
        if (!factCheckResult) return;
        const { slideId, suggestions } = factCheckResult;
        const originalSlide = slides.find(s => s.id === slideId);

        const updatedSlides = slides.map(s => {
            if (s.id === slideId) {
                return { ...s, title: suggestions.title, bulletPoints: suggestions.bulletPoints };
            }
            return s;
        });
        setSlides(updatedSlides);
        createCheckpoint(`Applied fact-check to "${originalSlide?.title || 'slide'}"`, { ...currentState, slides: updatedSlides });
        setFactCheckResult(null);
    }, [slides, factCheckResult, createCheckpoint, currentState, setSlides, setFactCheckResult]);
    
     const handleAdaptAudience = useCallback((targetAudience: string) => {
        adaptAudienceAction({
            targetAudience,
            adaptingAudienceSlideId,
            slides,
            setError,
            setSlides,
            setAdaptingAudienceSlideId,
            createCheckpoint,
            currentState,
        });
    }, [adaptingAudienceSlideId, slides, createCheckpoint, currentState, setError, setSlides, setAdaptingAudienceSlideId]);


    return {
        handleGenerateSpeakerNotesForSlide,
        handleGenerateKeyTakeaway,
        handleExpandSlide,
        handleFactCheckSlide,
        handleCloseFactCheck,
        handleApplyFactCheck,
        handleAdaptAudience,
    };
};
