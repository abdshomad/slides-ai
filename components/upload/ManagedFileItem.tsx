import React from 'react';
// FIX: Correct import path for types
import { ManagedFile } from '../../types/index';
import { XCircleIcon } from '../icons/XCircleIcon';

interface ManagedFileItemProps {
    managedFile: ManagedFile;
    onRemoveFile: (id: string) => void;
}

const ManagedFileItem: React.FC<ManagedFileItemProps> = ({ managedFile, onRemoveFile }) => {
    return (
        <li className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg flex items-center justify-between animate-fade-in">
            <div className="flex-grow pr-4 overflow-hidden">
                <p className="text-sm text-slate-800 dark:text-slate-200 truncate">{managedFile.file.name}</p>
                <div className="flex items-center gap-3 mt-1.5">
                    <div className="w-full bg-slate-300 dark:bg-slate-600 rounded-full h-1.5">
                        <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                managedFile.status === 'completed' ? 'bg-green-500' : 
                                managedFile.status === 'error' ? 'bg-red-500' : 'bg-pink-500'
                            }`}
                            style={{ width: `${managedFile.status === 'loading' ? managedFile.progress : 100}%` }}
                        />
                    </div>
                    <div className="w-24 text-right flex-shrink-0">
                        {managedFile.status === 'loading' && <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{managedFile.progress}%</span>}
                        {managedFile.status === 'completed' && <span className="text-xs text-green-500 dark:text-green-400 font-medium">Ready</span>}
                        {managedFile.status === 'error' && <span className="text-xs text-red-500 dark:text-red-400 font-medium">Upload failed</span>}
                    </div>
                </div>
            </div>
            <button
                onClick={() => onRemoveFile(managedFile.id)}
                className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 flex-shrink-0"
                aria-label={`Remove ${managedFile.file.name}`}
            >
                <XCircleIcon className="w-5 h-5" />
            </button>
        </li>
    );
};

export default ManagedFileItem;