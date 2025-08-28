import React from 'react';
import { DownloadIcon } from '../../icons/DownloadIcon';

interface SlidesStepHeaderProps {
  showDownloadButton: boolean;
  onDownload: () => void;
}

const SlidesStepHeader: React.FC<SlidesStepHeaderProps> = ({ showDownloadButton, onDownload }) => {
  return (
    <div className="flex justify-end items-center mb-6 h-12">
      {showDownloadButton && (
        <button
          onClick={onDownload}
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition-colors"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Download PPTX
        </button>
      )}
    </div>
  );
};

export default SlidesStepHeader;
