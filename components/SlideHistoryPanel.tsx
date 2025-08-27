import React, { useMemo } from 'react';
import { HistoryCheckpoint, AppState, Slide as SlideType } from '../types';

interface SlideHistoryPanelProps {
  history: HistoryCheckpoint[];
  slideId: string;
  onClose: () => void;
  onRestore: (slideState: SlideType) => void;
}

const findSlideInState = (state: AppState, slideId: string): SlideType | undefined => {
  return state.slides.find(s => s.id === slideId);
};

// Use a simplified JSON.stringify for object comparison
const simpleStringify = (obj: any) => {
    if (!obj) return '';
    const { title, bulletPoints, image, layout, speakerNotes, keyTakeaway } = obj;
    return JSON.stringify({ title, bulletPoints, image, layout, speakerNotes, keyTakeaway });
};


const SlideHistoryPanel: React.FC<SlideHistoryPanelProps> = ({ history, slideId, onClose, onRestore }) => {
  
  const slideHistory = useMemo(() => {
    if (!slideId) return [];

    const filteredHistory: { checkpoint: HistoryCheckpoint; slideState: SlideType }[] = [];
    let lastSlideStateString: string | null = null;

    for (const checkpoint of history) {
      const slideInThisState = findSlideInState(checkpoint.state, slideId);

      if (slideInThisState) {
        const currentSlideStateString = simpleStringify(slideInThisState);
        if (currentSlideStateString !== lastSlideStateString) {
          filteredHistory.push({ checkpoint, slideState: slideInThisState });
          lastSlideStateString = currentSlideStateString;
        }
      }
    }
    return filteredHistory.reverse(); // Show newest first
  }, [history, slideId]);

  const handleRestore = (slideState: SlideType) => {
    if (window.confirm('Are you sure you want to restore this version of the slide? This action will create a new checkpoint.')) {
      onRestore(slideState);
    }
  };

  const slideTitle = slideHistory[0]?.slideState.title || "Slide";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="slide-history-panel-title"
    >
      <div
        className="bg-slate-800 shadow-2xl w-full max-w-md h-full flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-4 border-b border-slate-700">
            <div>
                <h2 id="slide-history-panel-title" className="text-xl font-bold text-pink-400">
                    Slide History
                </h2>
                <p className="text-sm text-slate-400 truncate max-w-xs">For: "{slideTitle}"</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {slideHistory.length > 1 ? (
            <ul className="divide-y divide-slate-700">
                {slideHistory.map(({ checkpoint, slideState }, index) => {
                const isLatest = index === 0;
                return (
                    <li key={checkpoint.timestamp} className="p-4 hover:bg-slate-700/50">
                    <div className="flex justify-between items-start">
                        <div>
                        <p className={`font-semibold ${isLatest ? 'text-pink-400' : 'text-slate-200'}`}>
                            {checkpoint.action}
                            {isLatest && <span className="text-xs font-normal text-slate-400 ml-2">(Current)</span>}
                        </p>
                        <p className="text-sm text-slate-400">
                            {new Date(checkpoint.timestamp).toLocaleString()}
                        </p>
                        </div>
                        {!isLatest && (
                        <button
                            onClick={() => handleRestore(slideState)}
                            className="px-3 py-1 text-sm bg-slate-600 hover:bg-pink-600 rounded-md transition-colors"
                        >
                            Restore
                        </button>
                        )}
                    </div>
                    </li>
                );
                })}
            </ul>
          ) : (
            <div className="p-8 text-center text-slate-400">
                <p>No other versions of this slide have been saved.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideHistoryPanel;
