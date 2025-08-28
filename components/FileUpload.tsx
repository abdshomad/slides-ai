import React, { useState, useRef } from 'react';
// FIX: Correct import path for types
import { ManagedFile } from '../types/index';
import ManagedFilesList from './upload/ManagedFilesList';
import ManagedFileItem from './upload/ManagedFileItem';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  acceptedFileTypes?: string;
  managedFiles: ManagedFile[];
  onRemoveFile: (id: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange, acceptedFileTypes, managedFiles, onRemoveFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesChange(Array.from(e.target.files));
    }
     // Reset the input value to allow re-uploading the same file
    e.target.value = '';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesChange(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (managedFiles.length > 0) {
    return (
      <ManagedFilesList
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        isDragging={isDragging}
      >
        <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" accept={acceptedFileTypes} />
        <h3 className="text-lg font-semibold text-slate-300 mb-3">Context Files</h3>
        <ul className="space-y-3">
            {managedFiles.map(mf => (
              <ManagedFileItem 
                key={mf.id} 
                managedFile={mf} 
                onRemoveFile={onRemoveFile} 
              />
            ))}
        </ul>
        <button 
          type="button"
          onClick={handleClick} 
          className="mt-4 w-full text-center text-sm text-pink-400 hover:text-pink-300 font-semibold p-2 rounded-md hover:bg-slate-700/50 transition-colors"
        >
          + Add more files
        </button>
      </ManagedFilesList>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`p-6 border-2 border-dashed rounded-lg cursor-pointer h-full flex flex-col items-center justify-center transition-colors ${
        isDragging ? 'border-pink-500 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500'
      }`}
      role="button"
      aria-label="File upload area"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept={acceptedFileTypes}
      />
      <div className="flex flex-col items-center justify-center text-center text-slate-400">
        <UploadIcon className="w-10 h-10 mb-3" />
        <p className="font-semibold">Drag & drop files here, or click</p>
        <p className="text-sm">Use files as context for your presentation</p>
      </div>
    </div>
  );
};

export default FileUpload;