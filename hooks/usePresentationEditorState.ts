import { useMemo } from 'react';
// FIX: Correct import path for types
import { PresentationProject, AppState, PresentationTemplate, BrandKit } from '../types/index';
import { templates } from '../templates/index';
import useFileManager from './useFileManager';
import useTimer from './useTimer';
import useAutoSave from './useAutoSave';
import { useEditorState } from './states/useEditorState';
import { useEditorModals } from './states/useEditorModals';
import { useEditorActions } from './editor/useEditorActions';


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
        slides: state.slides,
        selectedTemplateId: state.selectedTemplateId,
        tone: state.tone,
    }), [
        state.generationStep, state.inputText, managedFiles, state.outline,
        state.sources, state.sourcedImages, state.slides, state.selectedTemplateId, state.tone
    ]);
    
    const selectedTemplate = useMemo(() => templates.find(t => t.id === state.selectedTemplateId) || templates[0], [state.selectedTemplateId]);

    // 4. Decomposed actions
    const editorActions = useEditorActions({
        presentation, onUpdatePresentation, onAddCheckpoint,
        state, setters,
        modalState, modalSetters,
        managedFiles,
        timer,
        currentState,
        selectedTemplate,
        brandKit,
    });
    
    // 5. Auto-save hook
    const autoSaveStatus = useAutoSave({
        presentation,
        currentState,
        isLoading: state.isLoading,
        onUpdatePresentation
    });
    
    // 6. Derived state
    const derivedState = useMemo(() => {
        return {
            hasContent: state.inputText.trim().length > 0 || managedFiles.length > 0,
            editingSlide: state.slides.find(s => s.id === modalState.editingSlideId) || null,
            stylingSlide: state.slides.find(s => s.id === modalState.stylingSlideId) || null,
            adaptingAudienceSlide: state.slides.find(s => s.id === modalState.adaptingAudienceSlideId) || null,
            error: state.error,
            autoSaveStatus,
            selectedTemplate,
            managedFiles,
        };
    }, [state.selectedTemplateId, state.inputText, managedFiles, state.slides, modalState.editingSlideId, modalState.stylingSlideId, modalState.adaptingAudienceSlideId, state.error, autoSaveStatus, selectedTemplate]);
    
    // 7. Assemble the final return object to match the original API
    return {
        state: {
            ...state,
            elapsedTime: timer.elapsedTime,
            isEditingTitle: modalState.isEditingTitle,
        },
        handlers: {
            ...editorActions,
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
        },
        derivedState,
    };
};

export default usePresentationEditorState;