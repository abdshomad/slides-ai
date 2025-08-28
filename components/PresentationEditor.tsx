


import React from 'react';
// FIX: Correct import path for types
import { PresentationProject, AppState } from '../types/index';
import usePresentationEditorState from '../hooks/usePresentationEditorState';
import HistoryPanel from './HistoryPanel';
import EditorHeader from './editor/EditorHeader';
import InputStep from './editor/InputStep';
import OutlineStep from './editor/OutlineStep';
import SlidesStep from './editor/SlidesStep';
import EditorModals from './editor/EditorModals';

interface PresentationEditorProps {
    presentation: PresentationProject;
    onUpdatePresentation: (id: string, updates: Partial<PresentationProject>) => void;
    onAddCheckpoint: (id:string, action: string, state: AppState) => void;
    onRollback: (id: string, checkpointIndex: number) => void;
    onExitEditor: () => void;
}

const PresentationEditor: React.FC<PresentationEditorProps> = (props) => {
  const { presentation, onRollback, onExitEditor } = props;

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
        isEditingTitle={state.isEditingTitle}
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
          managedFiles={derivedState.managedFiles}
          onFilesChange={handlers.handleFilesChange}
          onRemoveFile={handlers.handleRemoveFile}
          onGenerateOutline={handlers.handleGenerateOutline}
          isLoading={state.isLoading}
          loadingMessage={state.loadingMessage}
          hasContent={derivedState.hasContent}
          elapsedTime={state.elapsedTime}
          estimatedTime={state.estimatedTime}
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
          onDownload={handlers.handleDownload}
          onEditSlide={id => modals.setEditingSlideId(id)}
          onStyleSlide={id => modals.setStylingSlideId(id)}
          onGenerateNotes={handlers.handleGenerateSpeakerNotesForSlide}
          onGenerateTakeaway={handlers.handleGenerateKeyTakeaway}
          onGenerateImage={handlers.handleGenerateImageForSlide}
          onExpandSlide={handlers.handleExpandSlide}
          onViewSlideHistory={handlers.handleViewSlideHistory}
          onFactCheckSlide={handlers.handleFactCheckSlide}
          onCritiqueSlide={handlers.handleCritiqueSlide}
          onReorderSlides={handlers.handleReorderSlides}
          onSelectImageFromSearch={handlers.handleSelectImageFromSearch}
          currentLoadingStep={state.currentLoadingStep}
          currentLoadingSubStep={state.currentLoadingSubStep}
          generationStats={state.generationStats}
          elapsedTime={state.elapsedTime}
          estimatedTime={state.estimatedTime}
          selectedTemplate={derivedState.selectedTemplate}
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

      <EditorModals
        presentationHistory={presentation.history}
        editingSlide={derivedState.editingSlide}
        stylingSlide={derivedState.stylingSlide}
        historySlideId={modals.historySlideId}
        factCheckResult={modals.factCheckResult}
        critiqueResult={modals.critiqueResult}
        onCloseEditing={() => modals.setEditingSlideId(null)}
        onCloseStyling={() => modals.setStylingSlideId(null)}
        onCloseHistory={() => modals.setHistorySlideId(null)}
        onEditSlide={handlers.handleEditSlide}
        onStyleSlide={handlers.handleUpdateSlideLayout}
        onRestoreSlide={handlers.handleRestoreSlideFromHistory}
        onCloseFactCheck={handlers.handleCloseFactCheck}
        onApplyFactCheck={handlers.handleApplyFactCheck}
        onCloseCritique={handlers.handleCloseCritique}
      />
    </div>
  );
};

export default PresentationEditor;