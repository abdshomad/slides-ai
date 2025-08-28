import React from 'react';
// FIX: Correct import path for types
import { HistoryCheckpoint } from '../../types/index';

interface HistoryItemProps {
    checkpoint: HistoryCheckpoint;
    isLatest: boolean;
    onRollbackClick: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ checkpoint, isLatest, onRollbackClick }) => {
    return (
        <li className="p-4 hover:bg-slate-100 dark:hover:bg-slate-700/50">
            <div className="flex justify-between items-start">
                <div>
                    <p className={`font-semibold ${isLatest ? 'text-pink-600 dark:text-pink-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {checkpoint.action}
                        {isLatest && <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-2">(Latest)</span>}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(checkpoint.timestamp).toLocaleString()}
                    </p>
                </div>
                {!isLatest && (
                    <button
                        onClick={onRollbackClick}
                        className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-600 hover:bg-pink-500 dark:hover:bg-pink-600 text-slate-700 hover:text-white dark:text-white rounded-md transition-colors"
                    >
                        Restore
                    </button>
                )}
            </div>
        </li>
    );
};

export default HistoryItem;