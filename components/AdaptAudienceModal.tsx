import React, { useState } from 'react';
import { Slide } from '../types/index';
import { UsersIcon } from './icons/UsersIcon';
import { MagicIcon } from './icons';

interface AdaptAudienceModalProps {
  slide: Slide;
  onClose: () => void;
  onSave: (targetAudience: string) => void;
}

const AdaptAudienceModal: React.FC<AdaptAudienceModalProps> = ({ slide, onClose, onSave }) => {
  const [audience, setAudience] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (audience.trim()) {
      onSave(audience);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="adapt-audience-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 text-slate-900 dark:text-white transform transition-transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
                <UsersIcon className="w-7 h-7 mr-3 text-pink-500 dark:text-pink-400"/>
                <h2 id="adapt-audience-title" className="text-2xl font-bold text-pink-600 dark:text-pink-400">Adapt for a New Audience</h2>
            </div>
            <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-3xl leading-none" aria-label="Close">
                &times;
            </button>
        </div>

        <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Current Slide Content:</h3>
            <p className="font-bold text-slate-800 dark:text-slate-200">{slide.title}</p>
            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                {slide.bulletPoints.map((pt, i) => <li key={i}>{pt}</li>)}
            </ul>
        </div>

        <form onSubmit={handleSave}>
          <label htmlFor="audience-prompt" className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Who is the new audience?
          </label>
          <textarea
            id="audience-prompt"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g., 'A group of high school students', 'Potential investors with no technical background', 'Expert data scientists'"
            className="w-full h-28 p-4 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none transition-shadow"
            aria-label="New audience description"
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
              disabled={!audience.trim()}
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              <MagicIcon className="w-5 h-5 mr-2" />
              Rewrite Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdaptAudienceModal;