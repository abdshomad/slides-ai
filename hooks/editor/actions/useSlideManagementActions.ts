import { useCallback } from 'react';
import { downloadPptx } from '../../../utils/pptxGenerator';
import { Slide as SlideType } from '../../../types/index';
import { ActionHookProps } from './types';

export const useSlideManagementActions = ({
    presentation, onAddCheckpoint, onUpdatePresentation,
    state, setters, modalSetters,
    selectedTemplate, brandKit
}: ActionHookProps) => {
    const { slides, presentationTitle, currentState } = state;
    const { setSlides } = setters;
    const { setIsEditingTitle } = modalSetters;

    const createCheckpoint = useCallback((action: string, stateForCheckpoint: any) => {
        onAddCheckpoint(presentation.id, action, stateForCheckpoint);
    }, [onAddCheckpoint, presentation.id]);

    const handleReorderSlides = useCallback((startIndex: number, endIndex: number) => {
        setSlides((prevSlides: SlideType[]) => {
            const result = Array.from(prevSlides);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            createCheckpoint('Reordered slides', { ...currentState, slides: result });
            return result;
        });
    }, [createCheckpoint, currentState, setSlides]);

    const handleDownload = () => {
        downloadPptx(slides, selectedTemplate, presentationTitle, brandKit);
    };

    const handleSaveTitle = useCallback(() => {
        if (presentationTitle.trim() && presentationTitle !== presentation.title) {
            onUpdatePresentation(presentation.id, { title: presentationTitle });
            createCheckpoint('Renamed Presentation', currentState);
        }
        setIsEditingTitle(false);
    }, [presentation.id, presentation.title, presentationTitle, onUpdatePresentation, createCheckpoint, currentState, setIsEditingTitle]);
    
    return {
        handleReorderSlides,
        handleDownload,
        handleSaveTitle,
    };
};