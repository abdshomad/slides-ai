import React from 'react';
// FIX: Correct import path for types
import { Slide } from '../../types/index';
import Loader from '../Loader';
import { KeyIcon } from '../icons/KeyIcon';
import { NotesIcon } from '../icons/NotesIcon';

interface SlidePreviewActionsProps {
    slide: Slide;
    onGenerateTakeaway: () => void;
    onGenerateNotes: () => void;
    showNotes: boolean;
    setShowNotes: (show: boolean) => void;
}

const SlidePreviewActions: React.FC<SlidePreviewActionsProps> = ({ slide, onGenerateTakeaway, onGenerateNotes, showNotes, setShowNotes }) => {
    return (
        <div className="px-4 pb-4 flex flex-wrap justify-end gap-2 text-xs text-white">
            {!slide.keyTakeaway && (
                <button 
                    onClick={onGenerateTakeaway} 
                    disabled={slide.isGeneratingTakeaway}
                    className="inline-flex items-center justify-center px-3 py-1.5 bg-purple-600/80 hover:bg-purple-600 rounded-md transition-colors disabled:bg-slate-600 disabled:cursor-wait"
                    aria-label="Generate key takeaway"
                >
                    {slide.isGeneratingTakeaway ? <Loader/> : <KeyIcon className="w-3 h-3 mr-1.5" />}
                    Key Takeaway
                </button>
            )}
            
            {slide.isGeneratingNotes ? (
                <div className="flex items-center justify-center px-3 py-1.5 bg-slate-300 dark:bg-slate-600/50 rounded-md text-slate-700 dark:text-white" role="status" aria-live="polite">
                    <Loader />
                    <span className="ml-1.5">Generating...</span>
                </div>
            ) : slide.speakerNotes ? (
                <button 
                    onClick={() => setShowNotes(!showNotes)} 
                    className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-300 dark:bg-slate-600/50 hover:bg-slate-400 dark:hover:bg-slate-600 rounded-md transition-colors text-slate-700 dark:text-white"
                    aria-label={showNotes ? 'Hide speaker notes' : 'Show speaker notes'}
                    aria-expanded={showNotes}
                >
                    <NotesIcon className="w-3 h-3 mr-1.5" />
                    {showNotes ? 'Hide Notes' : 'Show Notes'}
                </button>
            ) : (
                <button 
                    onClick={onGenerateNotes} 
                    className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-300 dark:bg-slate-600/50 hover:bg-slate-400 dark:hover:bg-slate-600 rounded-md transition-colors text-slate-700 dark:text-white"
                    aria-label="Generate speaker notes"
                >
                    <NotesIcon className="w-3 h-3 mr-1.5" />
                    Generate Notes
                </button>
            )}
        </div>
    );
};

export default SlidePreviewActions;