import React from 'react';
// FIX: Correct import path for types
import { Slide as SlideType } from '../types/index';
import { EditIcon } from './icons/EditIcon';
import { StyleIcon } from './icons/StyleIcon';
import { KeyIcon } from './icons/KeyIcon';
import { NotesIcon } from './icons/NotesIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { ExpandIcon } from './icons/ExpandIcon';
import { MagicIcon } from './icons/MagicIcon';
import { FactCheckIcon } from './icons/FactCheckIcon';
import { ImageIcon } from './icons/ImageIcon';
import Loader from './Loader';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { UsersIcon } from './icons/UsersIcon';

interface SlideActionToolbarProps {
  slide: SlideType;
  onEdit: () => void;
  onStyle: () => void;
  onGenerateTakeaway: () => void;
  onGenerateNotes: () => void;
  onExpand: () => void;
  onViewHistory: () => void;
  onGenerateImage: () => void;
  onFactCheck: () => void;
  onCritiqueDesign: () => void;
  onAdaptAudience: () => void;
  onExportSlide: () => void;
  isExporting: boolean;
  showNotes: boolean;
  setShowNotes: (show: boolean) => void;
}

const buttonBaseClass = "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-wait";
const secondaryButtonClass = `${buttonBaseClass} bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200`;
const primaryButtonClass = `${buttonBaseClass} bg-purple-600 hover:bg-purple-700 text-white`;


const SlideActionToolbar: React.FC<SlideActionToolbarProps> = ({
  slide,
  onEdit,
  onStyle,
  onGenerateTakeaway,
  onGenerateNotes,
  onExpand,
  onViewHistory,
  onGenerateImage,
  onFactCheck,
  onCritiqueDesign,
  onAdaptAudience,
  onExportSlide,
  isExporting,
  showNotes,
  setShowNotes,
}) => {
  return (
    <div data-tour-id="ai-editing-tools" className="flex-shrink-0 p-4 bg-slate-200/50 dark:bg-slate-800/50 rounded-b-lg border-t border-slate-300/50 dark:border-slate-600/50 flex flex-wrap gap-3 justify-center items-center">
      {/* --- Group 1: Core Editing --- */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={onEdit} className={secondaryButtonClass}><EditIcon className="w-4 h-4 mr-2" />Edit</button>
        <button onClick={onStyle} className={secondaryButtonClass}><StyleIcon className="w-4 h-4 mr-2" />Style</button>
      </div>

      <div className="h-6 w-px bg-slate-300/80 dark:bg-slate-600/80 hidden sm:block"></div>

      {/* --- Group 2: AI Content Generation --- */}
      <div className="flex flex-wrap gap-3 justify-center">
        {slide.speakerNotes ? (
              <button onClick={() => setShowNotes(!showNotes)} className={secondaryButtonClass}><NotesIcon className="w-4 h-4 mr-2" />{showNotes ? 'Hide' : 'Show'} Notes</button>
        ) : (
            <button onClick={onGenerateNotes} disabled={slide.isGeneratingNotes} className={secondaryButtonClass}>
                {slide.isGeneratingNotes ? <><Loader />Generating...</> : <><NotesIcon className="w-4 h-4 mr-2" />Generate Notes</>}
            </button>
        )}
        {!slide.keyTakeaway && (
            <button onClick={onGenerateTakeaway} disabled={slide.isGeneratingTakeaway} className={secondaryButtonClass}>
                {slide.isGeneratingTakeaway ? <><Loader />Generating...</> : <><KeyIcon className="w-4 h-4 mr-2" />Key Takeaway</>}
            </button>
        )}
         {slide.imagePrompt && (
          <button onClick={onGenerateImage} disabled={slide.isLoadingImage} className={secondaryButtonClass}>
            {slide.isLoadingImage ? <><Loader />Generating...</> : <><MagicIcon className="w-4 h-4 mr-2" />{slide.image ? 'Regenerate' : 'Generate'} Image</>}
          </button>
        )}
        <button onClick={onAdaptAudience} disabled={slide.isAdaptingAudience} className={secondaryButtonClass}>
            {slide.isAdaptingAudience ? <><Loader />Adapting...</> : <><UsersIcon className="w-4 h-4 mr-2" />Adapt Audience</>}
        </button>
        <button onClick={onExpand} className={primaryButtonClass} disabled={slide.isExpanding}>
            {slide.isExpanding ? <><Loader />Expanding...</> : <><ExpandIcon className="w-4 h-4 mr-2" />Expand Slide</>}
        </button>
      </div>

      <div className="h-6 w-px bg-slate-300/80 dark:bg-slate-600/80 hidden sm:block"></div>
      
      {/* --- Group 3: AI Analysis --- */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={onFactCheck} disabled={slide.isFactChecking} className={secondaryButtonClass}>
            {slide.isFactChecking ? <><Loader />Fact Checking...</> : <><FactCheckIcon className="w-4 h-4 mr-2" />Fact Check</>}
        </button>
        <button onClick={onCritiqueDesign} disabled={slide.isCritiquing} className={secondaryButtonClass}>
            {slide.isCritiquing ? <><Loader />Getting Ideas...</> : <><LightbulbIcon className="w-4 h-4 mr-2" />Suggest Ideas</>}
        </button>
      </div>

      <div className="h-6 w-px bg-slate-300/80 dark:bg-slate-600/80 hidden sm:block"></div>

      {/* --- Group 4: Utilities --- */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={onViewHistory} className={secondaryButtonClass}><HistoryIcon className="w-4 h-4 mr-2" />View History</button>
        <button onClick={onExportSlide} disabled={isExporting} className={secondaryButtonClass}>
            {isExporting ? <><Loader />Exporting...</> : <><ImageIcon className="w-4 h-4 mr-2" />Export Slide</>}
        </button>
      </div>
    </div>
  );
};

export default SlideActionToolbar;