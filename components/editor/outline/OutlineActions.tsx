import React from 'react';
import Loader from '../../Loader';
import { MagicIcon } from '../../icons/MagicIcon';
import { ResearchIcon } from '../../icons/ResearchIcon';

interface OutlineActionsProps {
  onGenerateSlides: () => void;
  onRegenerateOutline: () => void;
  isLoading: boolean;
  loadingMessage: string;
  canGenerateSlides: boolean;
  slideCount: number;
}

const OutlineActions: React.FC<OutlineActionsProps> = ({
  onGenerateSlides,
  onRegenerateOutline,
  isLoading,
  loadingMessage,
  canGenerateSlides,
  slideCount,
}) => {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <button 
        onClick={onGenerateSlides} 
        disabled={isLoading || !canGenerateSlides} 
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-slate-500 disabled:cursor-not-allowed"
      >
        {isLoading ? <><Loader />{loadingMessage}</> : <><MagicIcon className="w-5 h-5 mr-2" />Approve & Create Slides</>}
      </button>
      <button 
        onClick={onRegenerateOutline} 
        disabled={isLoading} 
        className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
      >
        <ResearchIcon className="w-5 h-5 mr-2" />Regenerate Outline
      </button>
      {slideCount > 0 && (
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          ({slideCount} slides)
        </span>
      )}
    </div>
  );
};

export default OutlineActions;