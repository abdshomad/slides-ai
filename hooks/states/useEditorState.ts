
import { useState, useMemo } from 'react';
import { PresentationProject, Slide, Source, GenerationStats } from '../../types/index';

export const useEditorState = (presentation: PresentationProject) => {
    const latestState = useMemo(() => presentation.history[presentation.history.length - 1].state, [presentation]);

    const [generationStep, setGenerationStep] = useState<'input' | 'outline' | 'slides'>(latestState.generationStep);
    const [inputText, setInputText] = useState<string>(latestState.inputText);
    const [outline, setOutline] = useState<string>(latestState.outline);
    const [sources, setSources] = useState<Source[]>(latestState.sources);
    const [slides, setSlides] = useState<Slide[]>(latestState.slides);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>(latestState.selectedTemplateId);
    const [tone, setTone] = useState<string>(latestState.tone);
    const [presentationTitle, setPresentationTitle] = useState(presentation.title);
    
    // Loading and error states
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Slide generation progress states
    const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
    const [currentLoadingSubStep, setCurrentLoadingSubStep] = useState(0);
    const [generationStats, setGenerationStats] = useState<GenerationStats>({
        sourcesAnalyzed: latestState.sources.length,
        imagesSourced: latestState.slides.filter(s => s.imageSearchResults).length,
        imagesToGenerate: latestState.slides.filter(s => s.imagePrompt).length,
        slidesCreated: latestState.slides.length,
    });
    const [estimatedTime, setEstimatedTime] = useState(0);

    const state = {
        generationStep, inputText, outline, sources, slides, selectedTemplateId, tone, presentationTitle,
        isLoading, loadingMessage, error, currentLoadingStep, currentLoadingSubStep, generationStats, estimatedTime,
    };

    const setters = {
        setGenerationStep, setInputText, setOutline, setSources, setSlides, setSelectedTemplateId, setTone, setPresentationTitle,
        setIsLoading, setLoadingMessage, setError, setCurrentLoadingStep, setCurrentLoadingSubStep, setGenerationStats, setEstimatedTime,
    };

    return { state, setters };
};