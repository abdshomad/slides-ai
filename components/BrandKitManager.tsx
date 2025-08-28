

import React, { useState, useEffect, useRef } from 'react';
// FIX: Correct import path for types
import { BrandKit } from '../types/index';
import { PaletteIcon } from './icons/PaletteIcon';
import { UploadIcon } from './icons/UploadIcon';

interface BrandKitManagerProps {
  brandKit: BrandKit;
  onClose: () => void;
  onSave: (brandKit: BrandKit) => void;
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const fontOptions = [
  'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana',
  'Inter', 'Roboto', 'Lato', 'Montserrat', 'Open Sans', 'Poppins', 'Nunito'
];

const artStyles = [
    "Default", "Photorealistic", "Vector Art", "Watercolor",
    "Line Art", "3D Render", "Minimalist", "Impressionistic", "Pop Art"
];

const BrandKitManager: React.FC<BrandKitManagerProps> = ({ brandKit: initialBrandKit, onClose, onSave }) => {
  const [brandKit, setBrandKit] = useState(initialBrandKit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBrandKit(initialBrandKit);
  }, [initialBrandKit]);

  const handleSave = () => {
    onSave(brandKit);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await fileToDataUrl(file);
      setBrandKit(prev => ({ ...prev, logo: dataUrl }));
    }
     // Reset the input value to allow re-uploading the same file
    if (e.target) e.target.value = '';
  };

  const handleRemoveLogo = () => {
    setBrandKit(prev => ({ ...prev, logo: null }));
  }

  const handleColorChange = (key: 'primaryColor' | 'secondaryColor', value: string) => {
    setBrandKit(prev => ({ ...prev, [key]: value }));
  };

  const handleFieldChange = (key: keyof BrandKit, value: string) => {
    setBrandKit(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="brand-kit-title"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-xl text-slate-900 dark:text-white transform transition-transform scale-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <PaletteIcon className="w-7 h-7 mr-3 text-pink-500 dark:text-pink-400" />
            <h2 id="brand-kit-title" className="text-2xl font-bold text-pink-600 dark:text-pink-400">Brand Kit Customization</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-3xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto space-y-8 custom-scrollbar">
          {/* Logo Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">Logo</h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700/50 rounded-md flex items-center justify-center border border-slate-200 dark:border-slate-600">
                {brandKit.logo ? (
                  <img src={brandKit.logo} alt="Brand Logo Preview" className="max-w-full max-h-full object-contain" />
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
                {brandKit.logo && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="ml-3 text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recommended: PNG with transparent background.</p>
              </div>
            </div>
          </div>

          {/* Colors Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">Colors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  id="primaryColor"
                  value={brandKit.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-12 h-12 p-1 bg-white dark:bg-slate-700 border-none rounded-md cursor-pointer"
                  aria-label="Primary color picker"
                />
                <div>
                  <label htmlFor="primaryColor" className="font-medium text-slate-700 dark:text-slate-300">Primary Color</label>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{brandKit.primaryColor.toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  id="secondaryColor"
                  value={brandKit.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-12 h-12 p-1 bg-white dark:bg-slate-700 border-none rounded-md cursor-pointer"
                  aria-label="Secondary color picker"
                />
                <div>
                  <label htmlFor="secondaryColor" className="font-medium text-slate-700 dark:text-slate-300">Secondary Color</label>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{brandKit.secondaryColor.toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fonts & Style Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">Fonts & Style</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="primaryFont" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Font (Headings)</label>
                <select
                  id="primaryFont"
                  value={brandKit.primaryFont}
                  onChange={(e) => handleFieldChange('primaryFont', e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="secondaryFont" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Secondary Font (Body)</label>
                 <select
                  id="secondaryFont"
                  value={brandKit.secondaryFont}
                  onChange={(e) => handleFieldChange('secondaryFont', e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="visualStyle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Presentation Visual Style</label>
                 <select
                  id="visualStyle"
                  value={brandKit.visualStyle || 'Default'}
                  onChange={(e) => handleFieldChange('visualStyle', e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  {artStyles.map(style => <option key={style} value={style}>{style}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors"
          >
            Save Brand Kit
          </button>
        </div>
      </div>
      <style>{`
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; border-radius: 0.25rem; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
       `}</style>
    </div>
  );
};

export default BrandKitManager;