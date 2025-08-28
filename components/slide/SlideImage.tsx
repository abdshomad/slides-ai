import React from 'react';
import Loader from '../Loader';
import { MagicIcon } from '../icons/MagicIcon';
import ImageSearchResults from './ImageSearchResults';
// FIX: Correct import path for types
import { Slide as SlideType } from '../../types/index';

interface SlideImageProps {
    // Legacy props for SlidePreview compatibility
    isLoading?: boolean;
    image?: string;
    title: string;
    imagePrompt?: string;
    imageSearchResults?: { url: string; title: string }[];

    // Full slide object and new handlers for SlideDetailView
    slide?: SlideType;
    onGenerate?: () => void;
    onSelectImage?: (url: string) => void;
    onGenerateSuggestions?: () => void;
    onSelectSuggestion?: (suggestion: string) => void;
    onClearSelectedImage?: () => void;
    onCustomPrompt?: () => void;
}


const SlideImage: React.FC<SlideImageProps> = (props) => {
    // The new UI is only active if the full slide object and new handlers are passed.
    const useSuggestionUI = props.slide && props.onGenerateSuggestions && props.onSelectSuggestion && props.onClearSelectedImage && props.onCustomPrompt;

    if (useSuggestionUI) {
        const { slide, onGenerateSuggestions, onSelectSuggestion, onClearSelectedImage, onCustomPrompt } = props;
        const { isGeneratingSuggestions, image, imageSuggestions, isLoadingImage, imageSearchResults, imagePrompt, title } = slide;

        if (isGeneratingSuggestions) {
            return (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex flex-col items-center justify-center p-4 gap-2">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Finding inspiration...</p>
                    <div className="grid grid-cols-3 gap-3 w-full flex-grow">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-slate-300 dark:bg-slate-700 rounded-md animate-pulse flex items-center justify-center">
                               <Loader />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (image) {
            return (
                <div className="relative w-full h-full group">
                    <img src={`data:image/jpeg;base64,${image}`} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                            onClick={onClearSelectedImage}
                            className="px-4 py-2 bg-white/90 text-black font-semibold rounded-md hover:bg-white transition-colors"
                        >
                            Change Image
                        </button>
                    </div>
                </div>
            );
        }
        
        if (imageSuggestions && imageSuggestions.length > 0) {
            return (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex flex-col items-center justify-center p-2">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 flex-shrink-0">Image Suggestions</h4>
                    <div className="flex-grow w-full flex gap-2 overflow-x-auto pb-2">
                        {imageSuggestions.map((suggestion, i) => (
                            <button
                                key={i}
                                onClick={() => onSelectSuggestion(suggestion)}
                                className="w-32 h-full flex-shrink-0 bg-slate-300 dark:bg-slate-700 rounded-md overflow-hidden group relative transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                aria-label={`Select image suggestion ${i + 1}`}
                            >
                                <img src={`data:image/jpeg;base64,${suggestion}`} alt={`Suggestion ${i + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        // Fallback to initial generation results if they exist
        if (imageSearchResults && imageSearchResults.length > 0 && props.onSelectImage) {
            return <ImageSearchResults results={imageSearchResults} onSelect={props.onSelectImage} />;
        }
        if (isLoadingImage) {
             return (
                <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 h-full">
                    <Loader />
                    <span className="text-xs mt-2">Generating Image...</span>
                </div>
            );
        }
        if (imagePrompt && props.onGenerate) {
            return (
                <button
                    onClick={props.onGenerate}
                    className="w-full h-full flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors group"
                    aria-label={`Generate image for slide: ${title}`}
                >
                    <MagicIcon className="w-7 h-7 mb-2 text-pink-500 group-hover:text-pink-400 transition-colors" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Generate Image</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1 w-full truncate px-2">"{imagePrompt}"</p>
                </button>
            );
        }

        // Initial State for editing
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4 bg-slate-100 dark:bg-slate-800/80">
               <button
                   onClick={onGenerateSuggestions}
                   className="w-full flex-grow flex flex-col items-center justify-center p-2 text-center cursor-pointer bg-slate-200 dark:bg-slate-700/80 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors group"
                   aria-label={`Find images with AI for slide: ${title}`}
               >
                   <MagicIcon className="w-8 h-8 mb-2 text-pink-500 group-hover:text-pink-400 transition-colors" />
                   <p className="text-md font-semibold text-slate-800 dark:text-slate-200">Find Images with AI</p>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Get AI-generated suggestions</p>
               </button>
               <button
                    onClick={onCustomPrompt}
                    className="text-sm text-pink-600 dark:text-pink-400 hover:underline font-semibold"
               >
                   Or use a Custom Prompt
               </button>
           </div>
        );
    }
    
    // --- Fallback to original logic for SlidePreview ---
    const { isLoading, image, title, imagePrompt, imageSearchResults, onGenerate, onSelectImage } = props;
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                    <Loader />
                    <span className="text-xs mt-2">Loading Image...</span>
                </div>
            );
        }

        if (image) {
            return <img src={`data:image/jpeg;base64,${image}`} alt={title} className="w-full h-full object-cover" />;
        }

        if (imageSearchResults && imageSearchResults.length > 0 && onSelectImage) {
            return <ImageSearchResults results={imageSearchResults} onSelect={onSelectImage} />;
        }
        
        if (imagePrompt && onGenerate) {
            return (
                <button
                    onClick={onGenerate}
                    className="w-full h-full flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors group"
                    aria-label={`Generate image for slide: ${title}`}
                >
                    <MagicIcon className="w-7 h-7 mb-2 text-pink-500 group-hover:text-pink-400 transition-colors" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Generate Image</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1 w-full truncate px-2">"{imagePrompt}"</p>
                </button>
            );
        }

        return <span className="text-slate-400 dark:text-slate-500 text-sm">No Image</span>;
    };

    return (
        <div className="relative w-full h-40 bg-slate-200 dark:bg-slate-800 rounded-t-lg flex items-center justify-center overflow-hidden">
          {renderContent()}
      </div>
    );
};

export default SlideImage;