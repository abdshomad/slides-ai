import React from 'react';
import {
  EditIcon, StyleIcon, KeyIcon, NotesIcon, HistoryIcon, ExpandIcon, MagicIcon, FactCheckIcon, LightbulbIcon, UsersIcon
} from '../../icons';
import Loader from '../../Loader';
// FIX: Corrected import path for the Slide type.
import { Slide as SlideType } from '../../../types/index';
import ActionMenuItem from './ActionMenuItem';

// Match the props of the old SlideActionToolbar for a seamless replacement
interface ActionMenuContentProps {
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
  showNotes: boolean;
  setShowNotes: (show: boolean) => void;
  onItemClick: (action: () => void) => void;
}

const ActionMenuContent: React.FC<ActionMenuContentProps> = (props) => {
  const {
    slide, onEdit, onStyle, onGenerateTakeaway, onGenerateNotes, onExpand, onViewHistory,
    onGenerateImage, onFactCheck, onCritiqueDesign, onAdaptAudience,
    showNotes, setShowNotes, onItemClick
  } = props;
  const hasImageCapability = !['ONE_COLUMN_TEXT', 'TITLE_ONLY', 'SECTION_HEADER', 'QUOTE', 'TWO_COLUMN_TEXT', 'TIMELINE', 'COMPARISON'].includes(slide.layout || '');


  return (
    <>
      {/* Mobile-only handle and title */}
      <div className="sm:hidden w-12 h-1.5 bg-slate-300 dark:bg-slate-500 rounded-full mx-auto my-2" />
      <h3 className="sm:hidden text-lg font-bold text-center mb-2 text-slate-800 dark:text-slate-200">AI Tools & Actions</h3>
      
      <div className="px-2 pt-1">
        <h4 className="px-2 pb-1 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Edit</h4>
        <ActionMenuItem onClick={() => onItemClick(onEdit)}><EditIcon className="w-4 h-4 mr-3" />Edit Content</ActionMenuItem>
        <ActionMenuItem onClick={() => onItemClick(onStyle)}><StyleIcon className="w-4 h-4 mr-3" />Change Style</ActionMenuItem>
      </div>

      <div className="px-2 pt-2">
        <h4 className="px-2 pb-1 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Generate</h4>
        {slide.speakerNotes ? (
          <ActionMenuItem onClick={() => onItemClick(() => setShowNotes(!showNotes))}>
            <NotesIcon className="w-4 h-4 mr-3" />{showNotes ? 'Hide Notes' : 'Show Notes'}
          </ActionMenuItem>
        ) : (
          <ActionMenuItem onClick={() => onItemClick(onGenerateNotes)} disabled={slide.isGeneratingNotes}>
            {slide.isGeneratingNotes ? <Loader /> : <NotesIcon className="w-4 h-4 mr-3" />}
            {slide.isGeneratingNotes ? 'Generating...' : 'Generate Notes'}
          </ActionMenuItem>
        )}
        
        {!slide.keyTakeaway && (
          <ActionMenuItem onClick={() => onItemClick(onGenerateTakeaway)} disabled={slide.isGeneratingTakeaway}>
            {slide.isGeneratingTakeaway ? <Loader /> : <KeyIcon className="w-4 h-4 mr-3" />}
            {slide.isGeneratingTakeaway ? 'Generating...' : 'Key Takeaway'}
          </ActionMenuItem>
        )}

        {hasImageCapability && (
          <ActionMenuItem onClick={() => onItemClick(onGenerateImage)} disabled={slide.isLoadingImage}>
            {slide.isLoadingImage ? <Loader /> : <MagicIcon className="w-4 h-4 mr-3" />}
            {slide.isLoadingImage ? 'Processing...' : 'Generate / Edit Image'}
          </ActionMenuItem>
        )}
        
        <ActionMenuItem onClick={() => onItemClick(onAdaptAudience)} disabled={slide.isAdaptingAudience}>
          {slide.isAdaptingAudience ? <Loader /> : <UsersIcon className="w-4 h-4 mr-3" />}
          {slide.isAdaptingAudience ? 'Adapting...' : 'Adapt Audience'}
        </ActionMenuItem>
        
        <ActionMenuItem onClick={() => onItemClick(onExpand)} disabled={slide.isExpanding}>
          {slide.isExpanding ? <Loader /> : <ExpandIcon className="w-4 h-4 mr-3" />}
          {slide.isExpanding ? 'Expanding...' : 'Expand Slide'}
        </ActionMenuItem>
      </div>

      <div className="px-2 pt-2">
        <h4 className="px-2 pb-1 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Analyze</h4>
        <ActionMenuItem onClick={() => onItemClick(onFactCheck)} disabled={slide.isFactChecking}>
          {slide.isFactChecking ? <Loader /> : <FactCheckIcon className="w-4 h-4 mr-3" />}
          {slide.isFactChecking ? 'Checking...' : 'Fact Check'}
        </ActionMenuItem>
        
        <ActionMenuItem onClick={() => onItemClick(onCritiqueDesign)} disabled={slide.isCritiquing}>
          {slide.isCritiquing ? <Loader /> : <LightbulbIcon className="w-4 h-4 mr-3" />}
          {slide.isCritiquing ? 'Analyzing...' : 'Suggest Ideas'}
        </ActionMenuItem>
      </div>
      
      <div className="px-2 pt-2">
        <h4 className="px-2 pb-1 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Utilities</h4>
        <ActionMenuItem onClick={() => onItemClick(onViewHistory)}><HistoryIcon className="w-4 h-4 mr-3" />View History</ActionMenuItem>
      </div>
    </>
  );
};

export default ActionMenuContent;