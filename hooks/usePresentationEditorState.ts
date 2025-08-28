import { useMemo, useEffect } from 'react';
// FIX: Correct import path for types
import { PresentationProject, AppState, PresentationTemplate, BrandKit } from '../types/index';
import { templates } from '../templates/index';
import useFileManager from './useFileManager';
import useTimer from './useTimer';
import useAutoSave from './useAutoSave';
import { useEditorState } from './states/useEditorState';
import { useEditorModals } from './states/useEditorModals';
import { useOutlineActions } from './editor/actions/useOutlineActions';
import { useSlideContentActions } from './editor/actions/useSlideContentActions';
import { useSlideVisualActions } from './editor/actions/useSlideVisualActions';
import { useSlideManagementActions } from './editor/actions/useSlideManagementActions';
import { useHistoryActions } from './editor/actions/useHistoryActions';


interface PresentationEditorProps {
    presentation: PresentationProject;
    brandKit: BrandKit;
    onUpdatePresentation: (id: string, updates: Partial<PresentationProject>) => void;
    onAddCheckpoint: (id:string, action: string, state: AppState) => void;
}

const usePresentationEditorState = ({ presentation, brandKit, onUpdatePresentation, onAddCheckpoint }: PresentationEditorProps) => {
    // 1. Decomposed state management
    const { state, setters } = useEditorState(presentation);
    const { modalState, setters: modalSetters } = useEditorModals();
    
    // 2. Existing composed hooks
    const timer = useTimer();
    const { managedFiles, handleFilesChange, handleRemoveFile } = useFileManager();
    
    // 3. Memoize current state for actions and autosave
    const currentState = useMemo((): AppState => ({
        generationStep: state.generationStep,
        inputText: state.inputText,
        uploadedFileNames: managedFiles.map(f => f.file.name),
        outline: state.outline,
        sources: state.sources,
        sourcedImages: state.sourcedImages,
        slides: state.slides.map(({ isGeneratingVideo, videoGenerationProgress, ...slide }) => slide), // Omit transient state
        selectedTemplateId: state.selectedTemplateId,
        tone: state.tone,
    }), [
        state.generationStep, state.inputText, managedFiles, state.outline,
        state.sources, state.sourcedImages, state.slides, state.selectedTemplateId, state.tone
    ]);
    
    const selectedTemplate = useMemo(() => templates.find(t => t.id === state.selectedTemplateId) || templates[0], [state.selectedTemplateId]);

    // 4. Decomposed actions
    // FIX: Restructured `actionProps` to correctly pass `state` and `currentState` as top-level properties, matching the ActionHookProps type.
    const actionProps = {
        presentation, onUpdatePresentation, onAddCheckpoint,
        state, // Pass the whole state object
        setters, modalState, modalSetters,
        managedFiles, timer,
        currentState, // Pass the memoized currentState object
        selectedTemplate, brandKit
    };

    const outlineActions = useOutlineActions(actionProps);
    const contentActions = useSlideContentActions(actionProps);
    const visualActions = useSlideVisualActions(actionProps);
    const managementActions = useSlideManagementActions(actionProps);
    const historyActions = useHistoryActions(actionProps);
    
    // 5. Auto-save hook
    const autoSaveStatus = useAutoSave({
        presentation,
        currentState,
        isLoading: state.isLoading,
        onUpdatePresentation
    });
    
    // Add an effect to prevent accidental navigation while loading.
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            // Most modern browsers show a generic message for security reasons.
            event.returnValue = 'Are you sure you want to leave? Your presentation is still being generated.';
        };

        if (state.isLoading) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        } else {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [state.isLoading]);
    
    // 6. Derived state
    const derivedState = useMemo(() => {
        return {
            hasContent: state.inputText.trim().length > 0 || managedFiles.length > 0,
            editingSlide: state.slides.find(s => s.id === modalState.editingSlideId) || null,
            stylingSlide: state.slides.find(s => s.id === modalState.stylingSlideId) || null,
            adaptingAudienceSlide: state.slides.find(s => s.id === modalState.adaptingAudienceSlideId) || null,
            imageStudioSlide: state.slides.find(s => s.id === modalState.imageStudioSlideId) || null,
            error: state.error,
            autoSaveStatus,
            selectedTemplate,
            managedFiles,
        };
    }, [state.selectedTemplateId, state.inputText, managedFiles, state.slides, modalState.editingSlideId, modalState.stylingSlideId, modalState.adaptingAudienceSlideId, modalState.imageStudioSlideId, state.error, autoSaveStatus, selectedTemplate]);
    
    // 7. Assemble the final return object to match the original API
    return {
        state: {
            ...state,
            elapsedTime: timer.elapsedTime,
            isEditingTitle: modalState.isEditingTitle,
        },
        handlers: {
            ...outlineActions,
            ...contentActions,
            ...visualActions,
            ...managementActions,
            ...historyActions,
            handleContinueToEditor: () => {
                const nextStep = 'slides';
                setters.setGenerationStep(nextStep);
                onAddCheckpoint(presentation.id, 'Reviewed Images', { ...currentState, generationStep: nextStep });
            },
            // Expose setters and file handlers directly
            setInputText: setters.setInputText,
            setOutline: setters.setOutline,
            setTone: setters.setTone,
            setSelectedTemplateId: setters.setSelectedTemplateId,
            handleFilesChange,
            handleRemoveFile,
            setIsEditingTitle: modalSetters.setIsEditingTitle,
            setPresentationTitle: setters.setPresentationTitle,
        },
        modals: {
            isHistoryPanelOpen: modalState.isHistoryPanelOpen,
            setIsHistoryPanelOpen: modalSetters.setIsHistoryPanelOpen,
            editingSlideId: modalState.editingSlideId,
            setEditingSlideId: modalSetters.setEditingSlideId,
            stylingSlideId: modalState.stylingSlideId,
            setStylingSlideId: modalSetters.setStylingSlideId,
            historySlideId: modalState.historySlideId,
            setHistorySlideId: modalSetters.setHistorySlideId,
            factCheckResult: modalState.factCheckResult,
            setFactCheckResult: modalSetters.setFactCheckResult,
            critiqueResult: modalState.critiqueResult,
            setCritiqueResult: modalSetters.setCritiqueResult,
            adaptingAudienceSlideId: modalState.adaptingAudienceSlideId,
            setAdaptingAudienceSlideId: modalSetters.setAdaptingAudienceSlideId,
            isImageStudioOpen: modalState.isImageStudioOpen,
        },
        derivedState,
    };
};

export default usePresentationEditorState;