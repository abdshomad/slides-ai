import React, { useState, useEffect } from 'react';
import { Slide, BrandKit } from '../types/index';
import StudioTabs from './studio/StudioTabs';
import GenerateTab from './studio/GenerateTab';
import EditTab from './studio/EditTab';
import SuggestionsTab from './studio/SuggestionsTab';
import SearchTab from './studio/SearchTab';

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

export type Tab = 'generate' | 'edit' | 'suggestions' | 'search';

const ImageStudioModal: React.FC<ImageStudioModalProps> = (props) => {
    const { slide, onClose } = props;
    const [activeTab, setActiveTab] = useState<Tab>(slide.image ? 'edit' : 'generate');

    // Automatically switch tabs if the slide's image state changes (e.g., an image is generated)
    useEffect(() => {
        if (slide.image && activeTab === 'generate') {
            setActiveTab('edit');
        } else if (!slide.image && activeTab === 'edit') {
            setActiveTab('generate');
        }
    }, [slide.image, activeTab]);

    const renderContent = () => {
        switch (activeTab) {
            case 'edit':
                return <EditTab slide={slide} onEdit={props.onEditImage} onClose={onClose} />;
            case 'suggestions':
                return <SuggestionsTab slide={slide} onGenerateSuggestions={props.onGenerateSuggestions} onSelectSuggestion={props.onSelectSuggestion} onClose={onClose} />;
            case 'search':
                return <SearchTab slide={slide} onSelectFromSearch={props.onSelectFromSearch} onClose={onClose} />;
            case 'generate':
            default:
                return <GenerateTab slide={slide} brandKit={props.brandKit} onGenerateImage={props.onGenerateImage} onApplyStyleToAll={props.onApplyStyleToAll} onClose={onClose} />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="image-studio-title">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl text-slate-900 dark:text-white transform transition-transform" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 id="image-studio-title" className="text-xl font-bold text-pink-600 dark:text-pink-400">Image Studio</h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-3xl leading-none" aria-label="Close">&times;</button>
                </div>
                
                <StudioTabs
                    slide={slide}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                
                <div className="p-6">{renderContent()}</div>
            </div>
        </div>
    );
};

export default ImageStudioModal;