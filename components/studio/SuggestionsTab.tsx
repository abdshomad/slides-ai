import React from 'react';
import { Slide } from '../../types/index';
import Loader from '../Loader';
import { MagicIcon } from '../icons';

interface SuggestionsTabProps {
    slide: Slide;
    onGenerateSuggestions: (slideId: string) => void;
    onSelectSuggestion: (slideId: string, suggestion: string) => void;
    onClose: () => void;
}

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ slide, onGenerateSuggestions, onSelectSuggestion, onClose }) => {

    const handleSelectSuggestion = (suggestion: string) => {
        onSelectSuggestion(slide.id, suggestion);
        onClose();
    };
    
    if (slide.isGeneratingSuggestions) {
        return <div className="flex items-center justify-center h-48"><Loader /> <span className="ml-2">Finding inspiration...</span></div>;
    }

    if (!slide.imageSuggestions?.length) {
        return (
            <div className="text-center py-10">
                <p className="text-slate-500 mb-4">No suggestions available yet.</p>
                <button onClick={() => onGenerateSuggestions(slide.id)} className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
                    <MagicIcon className="w-5 h-5 mr-2 inline-block" />Generate Suggestions
                </button>
            </div>
        );
    }

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
};

export default SuggestionsTab;