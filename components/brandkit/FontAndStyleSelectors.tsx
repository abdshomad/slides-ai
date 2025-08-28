
import React from 'react';
import { BrandKit } from '../../types/index';

interface FontAndStyleSelectorsProps {
  primaryFont: string;
  secondaryFont: string;
  visualStyle?: string;
  onFieldChange: (key: keyof BrandKit, value: string) => void;
}

const fontOptions = [
  'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana',
  'Inter', 'Roboto', 'Lato', 'Montserrat', 'Open Sans', 'Poppins', 'Nunito'
];

const artStyles = [
    "Default", "Photorealistic", "Vector Art", "Watercolor",
    "Line Art", "3D Render", "Minimalist", "Impressionistic", "Pop Art"
];

const FontAndStyleSelectors: React.FC<FontAndStyleSelectorsProps> = (props) => {
    const { primaryFont, secondaryFont, visualStyle, onFieldChange } = props;
    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">Fonts & Style</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="primaryFont" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Font (Headings)</label>
                <select
                  id="primaryFont"
                  value={primaryFont}
                  onChange={(e) => onFieldChange('primaryFont', e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="secondaryFont" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Secondary Font (Body)</label>
                 <select
                  id="secondaryFont"
                  value={secondaryFont}
                  onChange={(e) => onFieldChange('secondaryFont', e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="visualStyle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Presentation Visual Style</label>
                 <select
                  id="visualStyle"
                  value={visualStyle || 'Default'}
                  onChange={(e) => onFieldChange('visualStyle', e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  {artStyles.map(style => <option key={style} value={style}>{style}</option>)}
                </select>
              </div>
            </div>
        </div>
    );
};

export default FontAndStyleSelectors;
