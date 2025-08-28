import React, { useState, useEffect } from 'react';
import { Slide, BrandKit } from '../types/index';
import { MagicIcon, EditIcon, ImageIcon, ResearchIcon } from './icons';
import Loader from './Loader';
import ImageSearchResults from './slide/ImageSearchResults';

interface ImageStudioModalProps {
    slide: Slide;
    brandKit: BrandKit;
    onClose: () => void;
    onGenerateImage: (slideId: string, prompt: string, negativePrompt?: string) => void;
    onEditImage: (slideId: string, prompt: string) => void;
    onGenerateSuggestions: (slideId: string) => void;
    onSelectSuggestion: (slideId: string, suggestion: string) => void;
    onSelectFromSearch: (slideId: string, url: string) => void;
    onApplyStyleToAll: (style: string, useBrandColors: boolean) => void;
}

type Tab = 'generate' | 'edit' | 'suggestions' | 'search';

const artStyles = [
    "Default", "Photorealistic", "Vector Art", "Watercolor",
    "Line Art", "3D Render", "Minimalist", "Impressionistic", "Pop Art"
];

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center gap-2 ${active ? 'bg-pink-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        role="tab"
        aria-selected={active}
    >
        {children}
    </button>
);


const ImageStudioModal: React.FC<ImageStudioModalProps> = (props) => {
    const { slide, brandKit, onClose } = props;
    const [activeTab, setActiveTab] = useState<Tab>(slide.image ? 'edit' : 'generate');

    const [prompt, setPrompt] = useState(slide.imagePrompt || slide.title);
    const [negativePrompt, setNegativePrompt] = useState(slide.negativeImagePrompt || '');
    const [style, setStyle] = useState(brandKit.visualStyle || 'Default');
    const [useBrandColors, setUseBrandColors] = useState(false);
    const [editPrompt, setEditPrompt] = useState('');
    
    useEffect(() => {
        if (slide.image && activeTab === 'generate') {
            setActiveTab('edit');
        } else if (!slide.image && activeTab === 'edit') {
            setActiveTab('generate');
        }
    }, [slide.image, activeTab]);

    const handleGenerate = () => {
        let fullPrompt = prompt;
        if (style !== 'Default') {
            fullPrompt += `, in the style of ${style.toLowerCase()}`;
        }
        if (useBrandColors) {
            fullPrompt += `, using a color palette inspired by ${brandKit.primaryColor} and ${brandKit.secondaryColor}`;
        }
        props.onGenerateImage(slide.id, fullPrompt, negativePrompt);
        onClose();
    };

    const handleApplyStyleToAll = () => {
        if (window.confirm("This will regenerate the images on all other slides to match this style. Are you sure?")) {
            props.onApplyStyleToAll(style, useBrandColors);
            onClose();
        }
    }

    const handleEdit = () => {
        props.onEditImage(slide.id, editPrompt);
        onClose();
    };

    const handleSelectSuggestion = (suggestion: string) => {
        props.onSelectSuggestion(slide.id, suggestion);
        onClose();
    };

    const handleSelectFromSearch = (url: string) => {
        props.onSelectFromSearch(slide.id, url);
        onClose();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'edit':
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Magic Edit</h3>
                        <div className="flex gap-4">
                            <div className="w-1/3 flex-shrink-0">
                                <img src={`data:image/jpeg;base64,${slide.image}`} alt="Current" className="rounded-lg object-cover w-full h-auto" />
                            </div>
                            <div className="flex-grow">
                                <label htmlFor="edit-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">How would you like to change it?</label>
                                <textarea id="edit-prompt" value={editPrompt} onChange={e => setEditPrompt(e.target.value)} placeholder="e.g., 'add a sun in the sky', 'make this black and white', 'remove the car'" className="w-full h-24 p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-pink-500" />
                                <button onClick={handleEdit} disabled={!editPrompt.trim()} className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-slate-500">
                                    <MagicIcon className="w-5 h-5 mr-2" /> Apply Edit
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'suggestions':
                 if (slide.isGeneratingSuggestions) return <div className="flex items-center justify-center h-48"><Loader /> <span className="ml-2">Finding inspiration...</span></div>;
                 if (!slide.imageSuggestions?.length) return (
                     <div className="text-center py-10">
                         <p className="text-slate-500 mb-4">No suggestions available yet.</p>
                         <button onClick={() => props.onGenerateSuggestions(slide.id)} className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
                             <MagicIcon className="w-5 h-5 mr-2 inline-block" />Generate Suggestions
                         </button>
                     </div>
                 );
                return (
                    <div className="space-y-3">
                         <h3 className="text-lg font-semibold">AI Suggestions</h3>
                         <div className="grid grid-cols-3 gap-3 h-48">
                            {slide.imageSuggestions.map((suggestion, i) => (
                                <button key={i} onClick={() => handleSelectSuggestion(suggestion)} className="rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                                    <img src={`data:image/jpeg;base64,${suggestion}`} alt={`Suggestion ${i+1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                         </div>
                    </div>
                );
            case 'search':
                if (!slide.imageSearchResults?.length) return <div className="text-center py-10"><p className="text-slate-500">No relevant web images were found for this slide.</p></div>;
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">From the Web</h3>
                        <div className="h-48">
                          <ImageSearchResults results={slide.imageSearchResults} onSelect={handleSelectFromSearch} />
                        </div>
                    </div>
                );
            case 'generate':
            default:
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
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="image-studio-title">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl text-slate-900 dark:text-white transform transition-transform" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 id="image-studio-title" className="text-xl font-bold text-pink-600 dark:text-pink-400">Image Studio</h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-3xl leading-none">&times;</button>
                </div>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex gap-2">
                        <TabButton active={activeTab === 'generate'} onClick={() => setActiveTab('generate')}><MagicIcon className="w-4 h-4" />Generate</TabButton>
                        {slide.image && <TabButton active={activeTab === 'edit'} onClick={() => setActiveTab('edit')}><EditIcon className="w-4 h-4" />Edit</TabButton>}
                        <TabButton active={activeTab === 'suggestions'} onClick={() => setActiveTab('suggestions')}><ImageIcon className="w-4 h-4" />Suggestions</TabButton>
                        {slide.imageSearchResults && slide.imageSearchResults.length > 0 && <TabButton active={activeTab === 'search'} onClick={() => setActiveTab('search')}><ResearchIcon className="w-4 h-4" />Web</TabButton>}
                    </div>
                </div>
                <div className="p-6">{renderContent()}</div>
            </div>
        </div>
    );
};

export default ImageStudioModal;