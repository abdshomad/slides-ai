import React from 'react';
import { PresentationProject, AppState } from '../types';
import usePresentationEditorState from '../hooks/usePresentationEditorState';
import EditSlideModal from './EditSlideModal';
import StyleSelectorModal from './StyleSelectorModal';
import HistoryPanel from './HistoryPanel';
import SlideHistoryPanel from './SlideHistoryPanel';
import EditorHeader from './editor/EditorHeader';
import InputStep from './editor/InputStep';
import OutlineStep from './editor/OutlineStep';
import SlidesStep from './editor/SlidesStep';

interface PresentationEditorProps {
    presentation: PresentationProject;
    onUpdatePresentation: (id: string, updates: Partial<PresentationProject>) => void;
    onAddCheckpoint: (id:string, action: string, state: AppState) => void;
    onRollback: (id: string, checkpointIndex: number) => void;
    onExitEditor: () => void;
}

const PresentationEditor: React.FC<PresentationEditorProps> = (props) => {
  const { presentation, onUpdatePresentation, onRollback, onExitEditor } = props;

  const {
    state,
    handlers,
    modals,
    derivedState,
  } = usePresentationEditorState(props);

  return (
    <div className="relative">
      <EditorHeader
        onExitEditor={onExitEditor}
        onOpenHistory={() => modals.setIsHistoryPanelOpen(true)}
        isEditingTitle={derivedState.isEditingTitle}
        setIsEditingTitle={handlers.setIsEditingTitle}
        presentationTitle={state.presentationTitle}
        setPresentationTitle={handlers.setPresentationTitle}
        onSaveTitle={handlers.handleSaveTitle}
        autoSaveStatus={derivedState.autoSaveStatus}
      />
      
      {state.generationStep === 'input' && (
        <InputStep
          inputText={state.inputText}
          setInputText={handlers.setInputText}
          managedFiles={state.managedFiles}
          onFilesChange={handlers.handleFilesChange}
          onRemoveFile={handlers.handleRemoveFile}
          onGenerateOutline={handlers.handleGenerateOutline}
          isLoading={state.isLoading}
          loadingMessage={state.loadingMessage}
          hasContent={derivedState.hasContent}
        />
      )}

      {state.generationStep === 'outline' && (
        <OutlineStep
          outline={state.outline}
          setOutline={handlers.setOutline}
          sources={state.sources}
          tone={state.tone}
          setTone={handlers.setTone}
          selectedTemplateId={state.selectedTemplateId}
          setSelectedTemplateId={handlers.setSelectedTemplateId}
          onGenerateSlides={handlers.handleGenerateSlidesFromOutline}
          onRegenerateOutline={handlers.handleGenerateOutline}
          isLoading={state.isLoading}
          loadingMessage={state.loadingMessage}
        />
      )}
      
      {derivedState.error && (
        <div className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-lg" role="alert">
          {derivedState.error}
        </div>
      )}

      {state.generationStep === 'slides' && (
        <SlidesStep
          slides={state.slides}
          isLoading={state.isLoading}
          loadingMessage={state.loadingMessage}
          selectedSlideId={state.selectedSlideId}
          onSelectSlide={handlers.setSelectedSlideId}
          onDownload={handlers.handleDownload}
          onEditSlide={id => modals.setEditingSlideId(id)}
          onStyleSlide={id => modals.setStylingSlideId(id)}
          onGenerateNotes={handlers.handleGenerateSpeakerNotesForSlide}
          onGenerateTakeaway={handlers.handleGenerateKeyTakeaway}
          onExpandSlide={handlers.handleExpandSlide}
          onViewHistory={id => modals.setHistorySlideId(id)}
          // Fix: Pass the onGenerateImage handler to the SlidesStep component.
          onGenerateImage={handlers.handleGenerateImageForSlide}
        />
      )}
    
      {modals.isHistoryPanelOpen && (
        <HistoryPanel
          history={presentation.history}
          onClose={() => modals.setIsHistoryPanelOpen(false)}
          onRollback={(index) => {
            onRollback(presentation.id, index);
            modals.setIsHistoryPanelOpen(false);
          }}
        />
      )}

      {derivedState.editingSlide && (
        <EditSlideModal
          slide={derivedState.editingSlide}
          onClose={() => modals.setEditingSlideId(null)}
          onSave={handlers.handleEditSlide}
        />
      )}
      
      {derivedState.stylingSlide && (
        <StyleSelectorModal
          slide={derivedState.stylingSlide}
          onClose={() => modals.setStylingSlideId(null)}
          onSave={handlers.handleUpdateSlideLayout}
        />
      )}

      {modals.historySlideId && (
        <SlideHistoryPanel
          history={presentation.history}
          slideId={modals.historySlideId}
          onClose={() => modals.setHistorySlideId(null)}
          onRestore={handlers.handleRestoreSlideState}
        />
      )}
    </div>
  );
};

export default PresentationEditor;