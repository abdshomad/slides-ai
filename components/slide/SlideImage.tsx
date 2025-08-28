import React from 'react';
import Loader from '../Loader';
import { MagicIcon } from '../icons/MagicIcon';
import ImageSearchResults from './ImageSearchResults';

interface SlideImageProps {
    isLoading?: boolean;
    image?: string;
    title: string;
    imagePrompt?: string;
    imageSearchResults?: { url: string; title: string }[];
    onGenerate?: () => void;
    onSelectImage?: (url: string) => void;
}


const SlideImage: React.FC<SlideImageProps> = (props) => {
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