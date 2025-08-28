import React from 'react';
// FIX: Correct import path for types
import { Slide, FactCheckResult } from '../types/index';
import { MagicIcon } from './icons/MagicIcon';
import { FactCheckIcon } from './icons/FactCheckIcon';

interface FactCheckModalProps {
  originalSlide: Slide;
  suggestions: FactCheckResult;
  onClose: () => void;
  onApply: () => void;
}

const FactCheckModal: React.FC<FactCheckModalProps> = ({ originalSlide, suggestions, onClose, onApply }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fact-check-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl p-6 sm:p-8 text-slate-900 dark:text-white transform transition-transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
                <FactCheckIcon className="w-8 h-8 mr-3 text-pink-500 dark:text-pink-400"/>
                <h2 id="fact-check-title" className="text-2xl font-bold text-pink-600 dark:text-pink-400">Fact-Check Results</h2>
            </div>
            <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-3xl leading-none" aria-label="Close">
                &times;
            </button>
        </div>

        <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">AI Analysis & Suggestions:</h3>
            <p className="text-slate-700 dark:text-slate-300">{suggestions.summaryOfChanges}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-semibold text-slate-500 dark:text-slate-400 mb-2 text-center">Original Version</h4>
                <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-lg h-full">
                    <p className="font-bold text-slate-700 dark:text-slate-300 text-lg mb-3">{originalSlide.title}</p>
                    <ul className="custom-bullets space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        {originalSlide.bulletPoints.map((pt, i) => <li key={`orig-${i}`}>{pt}</li>)}
                    </ul>
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2 text-center">Suggested Update</h4>
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 h-full">
                    <p className="font-bold text-green-700 dark:text-green-300 text-lg mb-3">{suggestions.title}</p>
                    <ul className="custom-bullets space-y-1 text-sm text-green-700/90 dark:text-green-300/90" style={{"--bullet-color": "#6EE7B7"} as React.CSSProperties}>
                        {suggestions.bulletPoints.map((pt, i) => <li key={`sugg-${i}`}>{pt}</li>)}
                    </ul>
                </div>
            </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onApply}
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
            >
              <MagicIcon className="w-5 h-5 mr-2" />
              Apply Changes
            </button>
        </div>
      </div>
       <style>{`
        .custom-bullets li::before {
            background-color: var(--bullet-color, #DB2777);
        }
       `}</style>
    </div>
  );
};

export default FactCheckModal;