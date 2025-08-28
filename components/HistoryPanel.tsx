import React from 'react';
// FIX: Correct import path for types
import { HistoryCheckpoint } from '../types/index';
import HistoryItem from './history/HistoryItem';

interface HistoryPanelProps {
  history: HistoryCheckpoint[];
  onClose: () => void;
  onRollback: (checkpointIndex: number) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClose, onRollback }) => {
  const handleRollback = (index: number) => {
    if (window.confirm('Are you sure you want to restore this version? Your current state will be saved as a new checkpoint.')) {
      onRollback(index);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-panel-title"
    >
      <div
        className="bg-white dark:bg-slate-800 shadow-2xl w-full max-w-md h-full flex flex-col text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id="history-panel-title" className="text-xl font-bold text-pink-600 dark:text-pink-400">
            Version History
          </h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-3xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {history
              .slice()
              .reverse()
              .map((checkpoint, index) => {
                const originalIndex = history.length - 1 - index;
                const isLatest = originalIndex === history.length - 1;

                return (
                  <HistoryItem 
                    key={checkpoint.timestamp}
                    checkpoint={checkpoint}
                    isLatest={isLatest}
                    onRollbackClick={() => handleRollback(originalIndex)}
                  />
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;