import React from 'react';
import { Slide as SlideType } from '../types';
import { EditIcon, StyleIcon, KeyIcon, NotesIcon, HistoryIcon, ExpandIcon, MagicIcon } from './icons';
import Loader from './Loader';

interface SlideActionToolbarProps {
  slide: SlideType;
  onEdit: () => void;
  onStyle: () => void;
  onGenerateTakeaway: () => void;
  onGenerateNotes: () => void;
  onExpand: () => void;
  onViewHistory: () => void;
  onGenerateImage: () => void;
  isLoading: boolean;
  showNotes: boolean;
  setShowNotes: (show: boolean) => void;
}

const SlideActionToolbar: React.FC<SlideActionToolbarProps> = ({
  slide,
  onEdit,
  onStyle,
  onGenerateTakeaway,
  onGenerateNotes,
  onExpand,
  onViewHistory,
  onGenerateImage,
  isLoading,
  showNotes,
  setShowNotes,
}) => {
  return (
    <div className="flex-shrink-0 p-4 bg-slate-800/50 rounded-b-lg border-t border-slate-600/50 flex flex-wrap gap-3 justify-center">
      <button onClick={onEdit} className="btn-secondary"><EditIcon className="w-4 h-4 mr-2" />Edit</button>
      <button onClick={onStyle} className="btn-secondary"><StyleIcon className="w-4 h-4 mr-2" />Style</button>
      
      {slide.imagePrompt && (
        <button onClick={onGenerateImage} disabled={slide.isLoadingImage} className="btn-secondary">
          {slide.isLoadingImage ? <><Loader />Generating...</> : <><MagicIcon className="w-4 h-4 mr-2" />{slide.image ? 'Regenerate' : 'Generate'} Image</>}
        </button>
      )}

      {slide.speakerNotes ? (
            <button onClick={() => setShowNotes(!showNotes)} className="btn-secondary"><NotesIcon className="w-4 h-4 mr-2" />{showNotes ? 'Hide' : 'Show'} Notes</button>
      ) : (
          <button onClick={onGenerateNotes} disabled={slide.isGeneratingNotes} className="btn-secondary">
              {slide.isGeneratingNotes ? <><Loader />Generating...</> : <><NotesIcon className="w-4 h-4 mr-2" />Generate Notes</>}
          </button>
      )}

      {!slide.keyTakeaway && (
          <button onClick={onGenerateTakeaway} disabled={slide.isGeneratingTakeaway} className="btn-secondary">
              {slide.isGeneratingTakeaway ? <><Loader />Generating...</> : <><KeyIcon className="w-4 h-4 mr-2" />Key Takeaway</>}
          </button>
      )}

      <button onClick={onExpand} className="btn-primary" disabled={isLoading}>
          {isLoading ? <><Loader />Expanding...</> : <><ExpandIcon className="w-4 h-4 mr-2" />Expand Slide</>}
      </button>

      <button onClick={onViewHistory} className="btn-secondary"><HistoryIcon className="w-4 h-4 mr-2" />View History</button>

      <style>{`
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          background-color: #334155;
          color: #E2E8F0;
          border-radius: 6px;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .btn-secondary:hover {
          background-color: #475569;
        }
        .btn-secondary:disabled {
          background-color: #475569;
          cursor: wait;
          opacity: 0.7;
        }
        .btn-primary {
           display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          background-color: #9333EA;
          color: white;
          border-radius: 6px;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .btn-primary:hover {
            background-color: #A855F7;
        }
         .btn-primary:disabled {
          background-color: #A855F7;
          cursor: wait;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default SlideActionToolbar;