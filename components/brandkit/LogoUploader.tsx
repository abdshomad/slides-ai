
import React, { useRef } from 'react';
import { UploadIcon } from '../icons/UploadIcon';

interface LogoUploaderProps {
  logo: string | null;
  onLogoChange: (logo: string | null) => void;
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const LogoUploader: React.FC<LogoUploaderProps> = ({ logo, onLogoChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await fileToDataUrl(file);
      onLogoChange(dataUrl);
    }
    if (e.target) e.target.value = ''; // Allow re-uploading the same file
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">Logo</h3>
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700/50 rounded-md flex items-center justify-center border border-slate-200 dark:border-slate-600">
          {logo ? (
            <img src={logo} alt="Brand Logo Preview" className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-sm text-slate-500 dark:text-slate-400">Preview</span>
          )}
        </div>
        <div className="flex-grow">
          <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600"
          >
            <UploadIcon className="w-5 h-5 mr-2" />
            Upload Logo
          </button>
          {logo && (
            <button
              type="button"
              onClick={() => onLogoChange(null)}
              className="ml-3 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Remove
            </button>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recommended: PNG with transparent background.</p>
        </div>
      </div>
    </div>
  );
};

export default LogoUploader;
