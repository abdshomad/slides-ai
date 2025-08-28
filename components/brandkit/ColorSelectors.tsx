
import React from 'react';

interface ColorSelectorsProps {
  primaryColor: string;
  secondaryColor: string;
  onColorChange: (key: 'primaryColor' | 'secondaryColor', value: string) => void;
}

const ColorSelectors: React.FC<ColorSelectorsProps> = ({ primaryColor, secondaryColor, onColorChange }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">Colors</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex items-center gap-4">
          <input
            type="color"
            id="primaryColor"
            value={primaryColor}
            onChange={(e) => onColorChange('primaryColor', e.target.value)}
            className="w-12 h-12 p-1 bg-white dark:bg-slate-700 border-none rounded-md cursor-pointer"
            aria-label="Primary color picker"
          />
          <div>
            <label htmlFor="primaryColor" className="font-medium text-slate-700 dark:text-slate-300">Primary Color</label>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{primaryColor.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="color"
            id="secondaryColor"
            value={secondaryColor}
            onChange={(e) => onColorChange('secondaryColor', e.target.value)}
            className="w-12 h-12 p-1 bg-white dark:bg-slate-700 border-none rounded-md cursor-pointer"
            aria-label="Secondary color picker"
          />
          <div>
            <label htmlFor="secondaryColor" className="font-medium text-slate-700 dark:text-slate-300">Secondary Color</label>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{secondaryColor.toUpperCase()}</p>
          </div>
        </div>
      </div>
       <style>{`
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; border-radius: 0.25rem; }
       `}</style>
    </div>
  );
};

export default ColorSelectors;
