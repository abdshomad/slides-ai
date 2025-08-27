import React from 'react';
import { ArrowLeftIcon, HistoryIcon } from '../icons';

interface EditorHeaderProps {
  onExitEditor: () => void;
  onOpenHistory: () => void;
  isEditingTitle: boolean;
  setIsEditingTitle: (isEditing: boolean) => void;
  presentationTitle: string;
  setPresentationTitle: (title: string) => void;
  onSaveTitle: () => void;
  autoSaveStatus: 'idle' | 'saving' | 'saved';
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  onExitEditor,
  onOpenHistory,
  isEditingTitle,
  setIsEditingTitle,
  presentationTitle,
  setPresentationTitle,
  onSaveTitle,
  autoSaveStatus,
}) => {
  const getStatusText = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'All changes saved';
      default:
        return '';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExitEditor} className="flex items-center text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Presentations
        </button>
        <div className="flex items-center">
          {autoSaveStatus !== 'idle' && (
            <span
              className="text-sm text-slate-400 mr-4 transition-opacity duration-300 ease-in-out"
              aria-live="polite"
            >
              {getStatusText()}
            </span>
          )}
          <button onClick={onOpenHistory} className="flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <HistoryIcon className="w-4 h-4 mr-2" />
            Project History
          </button>
        </div>
      </div>
      <div className="text-center mb-6">
        {isEditingTitle ? (
          <input
            type="text"
            value={presentationTitle}
            onChange={(e) => setPresentationTitle(e.target.value)}
            onBlur={onSaveTitle}
            onKeyDown={(e) => e.key === 'Enter' && onSaveTitle()}
            className="text-2xl font-bold bg-slate-700 text-center rounded-md p-1 -m-1"
            autoFocus
          />
        ) : (
          <h2 onClick={() => setIsEditingTitle(true)} className="text-2xl font-bold text-slate-200 cursor-pointer p-1 -m-1 rounded-md hover:bg-slate-700">
            {presentationTitle}
          </h2>
        )}
      </div>
    </>
  );
};

export default EditorHeader;