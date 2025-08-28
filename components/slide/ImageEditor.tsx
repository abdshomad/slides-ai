import React from 'react';
import Loader from '../Loader';
import { MagicIcon, ImageIcon } from '../icons';
import { Slide as SlideType } from '../../types/index';

interface ImageEditorProps {
    slide: SlideType;
    onOpenImageStudio: () => void;
}


const ImageEditor: React.FC<ImageEditorProps> = ({ slide, onOpenImageStudio }) => {
    const { image, isLoadingImage, title } = slide;

    const renderContent = () => {
        if (isLoadingImage) {
            return (
                <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 h-full">
                    <Loader />
                    <span className="text-xs mt-2">Processing Image...</span>
                </div>
            );
        }

        if (image) {
            return (
                <div className="relative w-full h-full group">
                    <img src={`data:image/jpeg;base64,${image}`} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <MagicIcon className="w-10 h-10 text-white" />
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4 bg-slate-100 dark:bg-slate-800/80">
                <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                <div className="text-center">
                    <p className="text-md font-semibold text-slate-700 dark:text-slate-300">Add Visual</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Use AI to generate or edit visuals.</p>
                </div>
            </div>
        );
    };

    return (
        <div 
            className="w-full h-full rounded-md overflow-hidden cursor-pointer bg-slate-200 dark:bg-slate-900/50"
            onClick={onOpenImageStudio}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenImageStudio()}
            role="button"
            tabIndex={0}
            aria-label="Open Visuals Studio"
        >
            {renderContent()}
        </div>
    );
};

export default ImageEditor;