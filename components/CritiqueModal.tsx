import React, { useMemo } from 'react';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface CritiqueModalProps {
  critique: string;
  onClose: () => void;
}

const SimpleMarkdownParser: React.FC<{ content: string }> = ({ content }) => {
    const html = useMemo(() => {
        return content
          .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-3 text-pink-500 dark:text-pink-400">$1</h1>')
          .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">$1</h2>')
          .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-3 mb-1 text-slate-700 dark:text-slate-300">$1</h3>')
          .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
          .replace(/^(<li>[\s\S]*?<\/li>)/gim, '<ul class="custom-bullets space-y-1">$1</ul>')
          .replace(/<\/ul>\n?<ul>/gim, '')
          .replace(/`([^`]+)`/g, '<code class="bg-slate-200 dark:bg-slate-700 text-pink-600 dark:text-pink-300 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br />');
    }, [content]);

    return <div className="text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: html }} />;
};


const CritiqueModal: React.FC<CritiqueModalProps> = ({ critique, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="critique-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl text-slate-900 dark:text-white transform transition-transform scale-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
                <LightbulbIcon className="w-7 h-7 mr-3 text-pink-500 dark:text-pink-400"/>
                <h2 id="critique-title" className="text-2xl font-bold text-pink-600 dark:text-pink-400">Design Suggestions</h2>
            </div>
            <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-3xl leading-none" aria-label="Close">
                &times;
            </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
            <SimpleMarkdownParser content={critique} />
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Close
            </button>
        </div>
      </div>
       <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
       `}</style>
    </div>
  );
};

export default CritiqueModal;