import { useCallback } from 'react';
import { Slide as SlideType, PresentationProject, AppState, ManagedFile, PresentationTemplate, BrandKit } from '../../types/index';
import { downloadPptx } from '../../utils/pptxGenerator';
import { parseOutline } from '../../utils/outlineParser';
import { generateOutlineAction } from '../actions/outlineActions';
import { generateSlidesAction } from '../actions/slideGenerationActions';
import * as slideEditingActions from '../actions/slideEditingActions';
import { fetchImageAsBase64 } from '../../utils/fileUtils';
import { critiqueSlide } from '../../services/slideEditingService';

// Define a type for the large props object for clarity
interface EditorActionsProps {
    presentation: PresentationProject;
    onUpdatePresentation: (id: string, updates: Partial<PresentationProject>) => void;
    onAddCheckpoint: (id: string, action: string, state: AppState) => void;
    state: any; // A simplified type for the state object from useEditorState
    setters: any; // A simplified type for the setters object from useEditorState
    modalState: any; // from useEditorModals
    modalSetters: any; // from useEditorModals
    managedFiles: ManagedFile[];
    timer: { startTimer: () => void; stopTimer: () => void; };
    currentState: AppState;
    selectedTemplate: PresentationTemplate;
    brandKit: BrandKit;
}


export const useEditorActions = ({
    presentation, onUpdatePresentation, onAddCheckpoint,
    state, setters, modalState, modalSetters,
    managedFiles, timer, currentState, selectedTemplate, brandKit
}: EditorActionsProps) => {
    const { 
        inputText, slides, outline, tone, sources, presentationTitle
    } = state;
    const { editingSlideId, stylingSlideId, factCheckResult, adaptingAudienceSlideId } = modalState;
    const { 
        setError, setIsLoading, setLoadingMessage, setOutline, setSources, setPresentationTitle, setGenerationStep,
        setSlides, setStylingSlideId, setCurrentLoadingStep, setCurrentLoadingSubStep, setGenerationStats,
        setFactCheckResult, setEstimatedTime, setSourcedImages
    } = setters;
    const { setEditingSlideId, setHistorySlideId, setIsEditingTitle, setCritiqueResult, setAdaptingAudienceSlideId } = modalSetters;
    const { startTimer, stopTimer } = timer;

    const createCheckpoint = useCallback((action: string, stateForCheckpoint: AppState) => {
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

    const handleContinueToEditor = useCallback(() => {
        const nextStep = 'slides';
        setters.setGenerationStep(nextStep);
        createCheckpoint('Reviewed Images', { ...currentState, generationStep: nextStep });
    }, [setters, createCheckpoint, currentState]);
  
    // FIX: Updated function to accept `prompt` and `negativePrompt` arguments to satisfy the `generateImageAction` type requirements.
    const handleGenerateImageForSlide = useCallback(
        (slideId: string, prompt: string, negativePrompt?: string) => slideEditingActions.generateImageAction({
            slideId,
            prompt,
            negativePrompt,
            slides,
            setSlides,
            createCheckpoint,
            currentState
        }), [slides, createCheckpoint, currentState, setSlides]
    );

    const handleEditSlide = useCallback(
        (prompt: string) => slideEditingActions.editSlideAction({
            prompt, editingSlideId, slides, setError, setSlides, setEditingSlideId, createCheckpoint, currentState
        }), [editingSlideId, slides, createCheckpoint, currentState, setError, setSlides, setEditingSlideId]
    );

    const handleUpdateSlideLayout = useCallback((layout: string) => {
        if (!stylingSlideId) return;
        const slideTitle = slides.find(s => s.id === stylingSlideId)?.title || 'slide';
        const updatedSlides = slides.map(s => s.id === stylingSlideId ? { ...s, layout } : s);
        setSlides(updatedSlides);
        createCheckpoint(`Changed layout for "${slideTitle}"`, { ...currentState, slides: updatedSlides });
        setStylingSlideId(null);
    }, [slides, stylingSlideId, createCheckpoint, currentState, setSlides, setStylingSlideId]);

    const handleGenerateSpeakerNotesForSlide = useCallback(
        (slideId: string) => slideEditingActions.generateNotesAction({
            slideId, slides, setError, setSlides, createCheckpoint, currentState
        }), [slides, createCheckpoint, currentState, setError, setSlides]
    );

    const handleGenerateKeyTakeaway = useCallback(
        (slideId: string) => slideEditingActions.generateTakeawayAction({
            slideId, slides, setError, setSlides, createCheckpoint, currentState
        }), [slides, createCheckpoint, currentState, setError, setSlides]
    );

    const handleExpandSlide = useCallback((slideId: string) => {
        slideEditingActions.expandSlideAction({
            slideId, slides, setError, setSlides, createCheckpoint, currentState
        });
    }, [slides, createCheckpoint, currentState, setError, setSlides]);

    const handleViewSlideHistory = (slideId: string) => {
        setHistorySlideId(slideId);
    };

    const handleRestoreSlideFromHistory = useCallback((slideState: SlideType) => {
        const updatedSlides = slides.map(s => s.id === slideState.id ? slideState : s);
        setSlides(updatedSlides);
        createCheckpoint(`Restored slide "${slideState.title}" from history`, { ...currentState, slides: updatedSlides });
        setHistorySlideId(null);
    }, [slides, createCheckpoint, currentState, setSlides, setHistorySlideId]);

    const handleFactCheckSlide = useCallback(
        (slideId: string) => slideEditingActions.factCheckSlideAction({
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

    const handleCritiqueSlide = useCallback(async (slideId: string, imageBase64: string) => {
        const slide = slides.find((s: SlideType) => s.id === slideId);
        if (!slide) return;

        setSlides((prev: SlideType[]) => prev.map(s => s.id === slideId ? { ...s, isCritiquing: true } : s));
        setError(null);
        try {
            const critique = await critiqueSlide(imageBase64);
            setCritiqueResult({ slideId, critique });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to get design suggestions.');
        } finally {
            setSlides((prev: SlideType[]) => prev.map(s => s.id === slideId ? { ...s, isCritiquing: false } : s));
        }
    }, [slides, setError, setSlides, setCritiqueResult]);

    const handleCloseCritique = useCallback(() => {
        setCritiqueResult(null);
    }, [setCritiqueResult]);

    const handleAdaptAudience = useCallback((targetAudience: string) => {
        slideEditingActions.adaptAudienceAction({
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


    const handleSelectImageFromSearch = useCallback(async (slideId: string, imageUrl: string) => {
        const slide = slides.find(s => s.id === slideId);
        if (!slide) return;

        setSlides((prev: SlideType[]) => prev.map(s => s.id === slideId ? { ...s, isLoadingImage: true } : s));
        try {
            const base64Image = await fetchImageAsBase64(imageUrl);
            setSlides((prevSlides: SlideType[]) => {
                const updatedSlides = prevSlides.map(s => s.id === slideId ? { ...s, image: base64Image, selectedImageUrl: imageUrl, isLoadingImage: false } : s);
                createCheckpoint(`Selected image for "${slide.title}"`, { ...currentState, slides: updatedSlides });
                return updatedSlides;
            });
        } catch (e) {
            setError("Failed to fetch the selected image.");
            setSlides((prev: SlideType[]) => prev.map(s => s.id === slideId ? { ...s, isLoadingImage: false } : s));
        }
    }, [slides, createCheckpoint, currentState, setError, setSlides]);

    const handleSaveTitle = useCallback(() => {
        if (presentationTitle.trim() && presentationTitle !== presentation.title) {
            onUpdatePresentation(presentation.id, { title: presentationTitle });
            createCheckpoint('Renamed Presentation', currentState);
        }
        setIsEditingTitle(false);
    }, [presentation.id, presentation.title, presentationTitle, onUpdatePresentation, createCheckpoint, currentState, setIsEditingTitle]);
    
    const handleDownload = () => {
        downloadPptx(slides, selectedTemplate, presentationTitle, brandKit);
    };
    
    const handleReorderSlides = useCallback((startIndex: number, endIndex: number) => {
        setSlides((prevSlides: SlideType[]) => {
            const result = Array.from(prevSlides);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            createCheckpoint('Reordered slides', { ...currentState, slides: result });
            return result;
        });
    }, [createCheckpoint, currentState, setSlides]);
    
    const handleGenerateImageSuggestions = useCallback(
        (slideId: string) => slideEditingActions.generateImageSuggestionsAction({
            slideId, slides, setSlides, createCheckpoint, currentState
        }), [slides, setSlides, createCheckpoint, currentState]
    );

    const handleSelectImageSuggestion = useCallback(
        (slideId: string, suggestion: string) => slideEditingActions.selectImageSuggestionAction({
            slideId, suggestion, slides, setSlides, createCheckpoint, currentState
        }), [slides, setSlides, createCheckpoint, currentState]
    );
    
    const handleClearSelectedImage = useCallback(
        (slideId: string) => slideEditingActions.clearSelectedImageAction({
            slideId, slides, setSlides, createCheckpoint, currentState
        }), [slides, setSlides, createCheckpoint, currentState]
    );

    return {
        handleGenerateOutline,
        handleGenerateSlidesFromOutline,
        handleContinueToEditor,
        handleGenerateImageForSlide,
        handleEditSlide,
        handleUpdateSlideLayout,
        handleGenerateSpeakerNotesForSlide,
        handleGenerateKeyTakeaway,
        handleExpandSlide,
        handleViewSlideHistory,
        handleRestoreSlideFromHistory,
        handleFactCheckSlide,
        handleCloseFactCheck,
        handleApplyFactCheck,
        handleCritiqueSlide,
        handleCloseCritique,
        handleAdaptAudience,
        handleSelectImageFromSearch,
        handleSaveTitle,
        handleDownload,
        handleReorderSlides,
        handleGenerateImageSuggestions,
        handleSelectImageSuggestion,
        handleClearSelectedImage,
    };
};
