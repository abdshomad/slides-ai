import React from 'react';
import { PresentationProject } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface PresentationListProps {
  presentations: PresentationProject[];
  onCreate: (title?: string) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const PresentationList: React.FC<PresentationListProps> = ({ presentations, onCreate, onSelect, onDelete }) => {

  const handleCreate = () => {
    onCreate();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-200">Your Presentations</h2>
        <button
          onClick={handleCreate}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center p-3 rounded-full text-slate-300 bg-slate-700 hover:bg-slate-600 hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 transition-all"
          aria-label="Create New Presentation"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      {presentations.length > 0 ? (
        <ul className="space-y-4">
          {presentations
            .slice()
            .sort((a, b) => b.lastModified - a.lastModified)
            .map((p) => (
            <li
              key={p.id}
              className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-700 transition-colors"
            >
              <div className="cursor-pointer flex-grow" onClick={() => onSelect(p.id)}>
                <h3 className="font-bold text-lg text-slate-200">{p.title}</h3>
                <p className="text-sm text-slate-400">
                  Last modified: {new Date(p.lastModified).toLocaleString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                   if (window.confirm(`Are you sure you want to delete "${p.title}"? This cannot be undone.`)) {
                     onDelete(p.id);
                   }
                }}
                className="p-2 text-slate-400 hover:text-red-400 rounded-full hover:bg-slate-600 transition-colors"
                aria-label={`Delete ${p.title}`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg">
          <h3 className="text-xl font-semibold text-slate-400">Loading your new presentation...</h3>
          <p className="text-slate-500 mt-2">Get ready to create!</p>
        </div>
      )}
    </div>
  );
};

export default PresentationList;