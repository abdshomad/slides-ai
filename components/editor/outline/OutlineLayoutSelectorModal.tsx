import React from 'react';

interface OutlineLayoutSelectorModalProps {
  currentLayout: string;
  onClose: () => void;
  onSave: (layout: string) => void;
}

const layoutOptions = [
    { id: 'DEFAULT', name: 'Image Right, Text Left', description: 'Standard layout with visual on the right.' },
    { id: 'DEFAULT_REVERSE', name: 'Image Left, Text Right', description: 'Visual on the left, supporting text on the right.' },
    { id: 'ONE_COLUMN_TEXT', name: 'Text Only', description: 'A title and bullet points, with no image.' },
    { id: 'TWO_COLUMN_TEXT', name: 'Two Column Text', description: 'Organize text into two distinct columns under a main title.' },
    { id: 'TIMELINE', name: 'Timeline', description: 'Present a sequence of events chronologically.' },
    { id: 'TITLE_ONLY', name: 'Title Only', description: 'A full-slide title for section breaks or intros.' },
    { id: 'SECTION_HEADER', name: 'Section Header', description: 'A title with a supporting subtitle. Great for introductions.' },
    { id: 'MAIN_POINT_EMPHASIS', name: 'Main Point Emphasis', description: 'Highlight a key number, phrase, or statement.' },
    { id: 'QUOTE', name: 'Quote', description: 'Feature a compelling quote with attribution.' },
    { id: 'COMPARISON', name: 'Comparison', description: 'Place two blocks of content side-by-side for comparison.' },
];


const OutlineLayoutSelectorModal: React.FC<OutlineLayoutSelectorModalProps> = ({ currentLayout, onClose, onSave }) => {

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="style-slide-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 text-slate-900 dark:text-white transform transition-transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
            <h2 id="style-slide-title" className="text-2xl font-bold text-pink-600 dark:text-pink-400">Select Slide Layout</h2>
            <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-3xl leading-none" aria-label="Close">
                &times;
            </button>
        </div>

        <div className="space-y-4">
            {layoutOptions.map(option => (
                <div
                    key={option.id}
                    onClick={() => onSave(option.id)}
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSave(option.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center
                        ${currentLayout === option.id ? 'border-pink-500 bg-slate-100 dark:bg-slate-700/50 shadow-lg' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100/70 dark:hover:bg-slate-700/30'}
                    `}
                    role="button"
                    aria-pressed={currentLayout === option.id}
                >
                    <div className="flex-grow">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{option.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{option.description}</p>
                    </div>
                     {currentLayout === option.id && (
                        <div className="ml-4 flex-shrink-0">
                            <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OutlineLayoutSelectorModal;