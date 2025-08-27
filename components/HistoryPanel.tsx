import React from 'react';
import { HistoryCheckpoint } from '../types';

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
        className="bg-slate-800 shadow-2xl w-full max-w-md h-full flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 id="history-panel-title" className="text-xl font-bold text-pink-400">
            Version History
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <ul className="divide-y divide-slate-700">
            {history
              .slice()
              .reverse()
              .map((checkpoint, index) => {
                const originalIndex = history.length - 1 - index;
                const isLatest = originalIndex === history.length - 1;

                return (
                  <li key={checkpoint.timestamp} className="p-4 hover:bg-slate-700/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`font-semibold ${isLatest ? 'text-pink-400' : 'text-slate-200'}`}>
                          {checkpoint.action}
                          {isLatest && <span className="text-xs font-normal text-slate-400 ml-2">(Latest)</span>}
                        </p>
                        <p className="text-sm text-slate-400">
                          {new Date(checkpoint.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!isLatest && (
                        <button
                          onClick={() => handleRollback(originalIndex)}
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
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
