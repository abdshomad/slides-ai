import React, { useState } from 'react';
import { Slide } from '../types';
import { MagicIcon } from './icons';

interface EditSlideModalProps {
  slide: Slide;
  onClose: () => void;
  onSave: (prompt: string) => void;
}

const EditSlideModal: React.FC<EditSlideModalProps> = ({ slide, onClose, onSave }) => {
  const [prompt, setPrompt] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSave(prompt);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-slide-title"
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 text-white transform transition-transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
            <h2 id="edit-slide-title" className="text-2xl font-bold text-pink-400">Edit Slide</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
                &times;
            </button>
        </div>

        <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
            <h3 className="font-semibold text-slate-300 mb-2">Current Slide: "{slide.title}"</h3>
            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                {slide.bulletPoints.map((pt, i) => <li key={i}>{pt}</li>)}
            </ul>
        </div>

        <form onSubmit={handleSave}>
          <label htmlFor="edit-prompt" className="block text-lg font-semibold text-slate-300 mb-2">
            How would you like to change it?
          </label>
          <textarea
            id="edit-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Make the title more catchy', 'Change the image to a picture of a sunset', 'Simplify the second bullet point'"
            className="w-full h-28 p-4 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none transition-shadow"
            aria-label="Edit instructions"
          />
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              <MagicIcon className="w-5 h-5 mr-2" />
              Update Slide
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSlideModal;