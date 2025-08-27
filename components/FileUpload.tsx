import React, { useState, useRef } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  acceptedFileTypes?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange, acceptedFileTypes }) => {
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