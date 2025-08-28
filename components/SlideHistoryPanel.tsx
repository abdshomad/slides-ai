import React, { useMemo, useState } from 'react';
// FIX: Correct import path for types
import { HistoryCheckpoint, Slide as SlideType } from '../types/index';
import { getSlideHistory } from '../utils/historyUtils';
import { CopyIcon } from './icons/CopyIcon';

interface SlideHistoryPanelProps {
  history: HistoryCheckpoint[];
  slideId: string;
  onClose: () => void;
  onRestore: (slideState: SlideType) => void;
}

const SlideHistoryPanel: React.FC<SlideHistoryPanelProps> = ({ history, slideId, onClose, onRestore }) => {
  
  const slideHistory = useMemo(() => getSlideHistory(history, slideId), [history, slideId]);
  const [copiedTimestamp, setCopiedTimestamp] = useState<number | null>(null);

  const handleRestore = (slideState: SlideType) => {
    if (window.confirm('Are you sure you want to restore this version of the slide? This action will create a new checkpoint.')) {
      onRestore(slideState);
    }
  };

  const handleCopyContent = (slideState: SlideType, timestamp: number) => {
    const contentToCopy = `Title: ${slideState.title}\n\n${slideState.bulletPoints.map(p => `- ${p}`).join('\n')}`;
    navigator.clipboard.writeText(contentToCopy).then(() => {
      setCopiedTimestamp(timestamp);
      setTimeout(() => setCopiedTimestamp(null), 2000);
    });
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
        className="bg-white dark:bg-slate-800 shadow-2xl w-full max-w-md h-full flex flex-col text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-4 border-b border-slate-200 dark:border-slate-700">
            <div>
                <h2 id="slide-history-panel-title" className="text-xl font-bold text-pink-600 dark:text-pink-400">
                    Slide History
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">For: "{slideTitle}"</p>
          </div>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-3xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {slideHistory.length > 1 ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {slideHistory.map(({ checkpoint, slideState }, index) => {
                const isLatest = index === 0;
                const isCopied = copiedTimestamp === checkpoint.timestamp;

                return (
                    <li key={checkpoint.timestamp} className={`p-4 transition-colors ${isLatest ? 'bg-slate-100 dark:bg-slate-700/80 border-l-4 border-pink-500' : 'hover:bg-slate-100/70 dark:hover:bg-slate-700/50'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`font-semibold ${isLatest ? 'text-pink-600 dark:text-pink-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                    {checkpoint.action}
                                    {isLatest && <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-2">(Current)</span>}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {new Date(checkpoint.timestamp).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                <button
                                    onClick={() => handleCopyContent(slideState, checkpoint.timestamp)}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center ${
                                        isCopied 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-slate-200 dark:bg-slate-600/70 hover:bg-purple-500 dark:hover:bg-purple-600 text-slate-700 dark:text-slate-300 hover:text-white'
                                    }`}
                                    disabled={isCopied}
                                >
                                    {isCopied ? 'Copied!' : <><CopyIcon className="w-4 h-4 mr-1.5" /> Copy</>}
                                </button>
                                {!isLatest && (
                                <button
                                    onClick={() => handleRestore(slideState)}
                                    className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-600 hover:bg-pink-500 dark:hover:bg-pink-600 text-slate-700 dark:text-white hover:text-white rounded-md transition-colors"
                                >
                                    Restore
                                </button>
                                )}
                            </div>
                        </div>
                    </li>
                );
                })}
            </ul>
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <p>No other versions of this slide have been saved.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideHistoryPanel;