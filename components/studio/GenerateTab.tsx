import React, { useState } from 'react';
import { Slide, BrandKit } from '../../types/index';
import { MagicIcon } from '../icons';

interface GenerateTabProps {
    slide: Slide;
    brandKit: BrandKit;
    onGenerateImage: (slideId: string, prompt: string, negativePrompt?: string) => void;
    onApplyStyleToAll: (style: string, useBrandColors: boolean) => void;
    onClose: () => void;
}

const artStyles = [
    "Default", "Photorealistic", "Vector Art", "Watercolor",
    "Line Art", "3D Render", "Minimalist", "Impressionistic", "Pop Art"
];

const GenerateTab: React.FC<GenerateTabProps> = ({ slide, brandKit, onGenerateImage, onApplyStyleToAll, onClose }) => {
    const [prompt, setPrompt] = useState(slide.imagePrompt || slide.title);
    const [negativePrompt, setNegativePrompt] = useState(slide.negativeImagePrompt || '');
    const [style, setStyle] = useState(brandKit.visualStyle || 'Default');
    const [useBrandColors, setUseBrandColors] = useState(false);

    const handleGenerate = () => {
        let fullPrompt = prompt;
        if (style !== 'Default') {
            fullPrompt += `, in the style of ${style.toLowerCase()}`;
        }
        if (useBrandColors) {
            fullPrompt += `, using a color palette inspired by ${brandKit.primaryColor} and ${brandKit.secondaryColor}`;
        }
        onGenerateImage(slide.id, fullPrompt, negativePrompt);
        onClose();
    };

    const handleApplyStyleToAll = () => {
        if (window.confirm("This will regenerate the images on all other slides to match this style. Are you sure?")) {
            onApplyStyleToAll(style, useBrandColors);
            onClose();
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prompt</label>
                <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A futuristic city skyline at sunset, vector art" className="w-full h-20 p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-pink-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="negative-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Negative Prompt</label>
                    <input id="negative-prompt" type="text" value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder="text, watermark, blurry" className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" />
                </div>
                <div>
                    <label htmlFor="style" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Art Style</label>
                    <select id="style" value={style} onChange={e => setStyle(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                        {artStyles.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex items-center">
                <input type="checkbox" id="brand-colors" checked={useBrandColors} onChange={e => setUseBrandColors(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                <label htmlFor="brand-colors" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">Incorporate Brand Colors</label>
            </div>
            <div className="flex gap-4">
                <button onClick={handleGenerate} disabled={!prompt.trim()} className="flex-grow inline-flex items-center justify-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-slate-500">
                    <MagicIcon className="w-5 h-5 mr-2" /> Generate Image
                </button>
                <button onClick={handleApplyStyleToAll} disabled={style === 'Default' && !useBrandColors} className="flex-shrink-0 px-4 py-2 text-sm bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    Apply Style to All
                </button>
            </div>
        </div>
    );
};

export default GenerateTab;