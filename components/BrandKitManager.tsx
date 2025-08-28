
import React, { useState, useEffect } from 'react';
import { BrandKit } from '../types/index';
import { PaletteIcon } from './icons/PaletteIcon';
import LogoUploader from './brandkit/LogoUploader';
import ColorSelectors from './brandkit/ColorSelectors';
import FontAndStyleSelectors from './brandkit/FontAndStyleSelectors';

interface BrandKitManagerProps {
  brandKit: BrandKit;
  onClose: () => void;
  onSave: (brandKit: BrandKit) => void;
}

const BrandKitManager: React.FC<BrandKitManagerProps> = ({ brandKit: initialBrandKit, onClose, onSave }) => {
  const [brandKit, setBrandKit] = useState(initialBrandKit);

  useEffect(() => {
    setBrandKit(initialBrandKit);
  }, [initialBrandKit]);

  const handleSave = () => {
    onSave(brandKit);
  };

  const handleStateChange = (key: keyof BrandKit, value: any) => {
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
          <LogoUploader
            logo={brandKit.logo}
            onLogoChange={(newLogo) => handleStateChange('logo', newLogo)}
          />

          <ColorSelectors
            primaryColor={brandKit.primaryColor}
            secondaryColor={brandKit.secondaryColor}
            onColorChange={(key, value) => handleStateChange(key, value)}
          />
          
          <FontAndStyleSelectors
            primaryFont={brandKit.primaryFont}
            secondaryFont={brandKit.secondaryFont}
            visualStyle={brandKit.visualStyle}
            onFieldChange={handleStateChange}
          />
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
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
       `}</style>
    </div>
  );
};

export default BrandKitManager;
