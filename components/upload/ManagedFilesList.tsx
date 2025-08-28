import React from 'react';

interface ManagedFilesListProps extends React.PropsWithChildren<{}> {
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    isDragging: boolean;
}

const ManagedFilesList: React.FC<ManagedFilesListProps> = ({ children, onDrop, onDragOver, onDragEnter, onDragLeave, isDragging }) => {
    return (
        <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            className={`p-6 border-2 border-dashed rounded-lg h-full flex flex-col transition-colors ${
            isDragging ? 'border-pink-500 bg-slate-100/50 dark:bg-slate-700/50' : 'border-slate-300 dark:border-slate-600'
            }`}
        >
            <div className="w-full">
                {children}
            </div>
      </div>
    );
};

export default ManagedFilesList;