import React, { useState } from 'react';
import { ParsedSlide } from '../../../utils/outlineParser';
import { MagicIcon } from '../../icons/MagicIcon';
import Loader from '../../Loader';

interface RegenerateSlideModalProps {
  slide: ParsedSlide;
  onClose: () => void;
  onSave: (prompt: string) => Promise<void>;
}

const RegenerateSlideModal: React.FC<RegenerateSlideModalProps> = ({ slide, onClose, onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      setIsLoading(true);
      await onSave(prompt);
      // The parent will close the modal, so we don't need to setIsLoading(false) here.
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="regenerate-slide-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 text-slate-900 dark:text-white transform transition-transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
            <h2 id="regenerate-slide-title" className="text-2xl font-bold text-pink-600 dark:text-pink-400">Regenerate Slide</h2>
            <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-3xl leading-none" aria-label="Close">
                &times;
            </button>
        </div>

        <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Current Slide: "{slide.title}"</h3>
            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                {slide.points.map((pt, i) => <li key={i}>{pt}</li>)}
            </ul>
        </div>

        <form onSubmit={handleSave}>
          <label htmlFor="regenerate-prompt" className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            How would you like to change it?
          </label>
          <textarea
            id="regenerate-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Make this more professional', 'Focus on the Q3 financial results', 'Add a point about future outlook'"
            className="w-full h-28 p-4 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none transition-shadow"
            aria-label="Regeneration instructions"
          />
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Loader /> : <MagicIcon className="w-5 h-5 mr-2" />}
              {isLoading ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegenerateSlideModal;