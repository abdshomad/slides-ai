import React from 'react';
import { ParsedSlide } from '../../../utils/outlineParser';
import SlideLayoutWireframe from '../SlideLayoutWireframe';
import { PlusIcon, TrashIcon } from '../../icons';

interface OutlinePreviewProps {
    parsedOutline: ParsedSlide[];
    onEditLayout: (index: number) => void;
    onAddSlide: (index: number) => void;
    onRemoveSlide: (index: number) => void;
}

const AddSlideButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
     <div className="h-6 flex items-center justify-center -my-3 group/add z-10 relative">
        <button 
            onClick={onClick}
            className="opacity-0 group-hover/add:opacity-100 transition-opacity flex items-center text-pink-500 hover:text-pink-400"
            aria-label="Add a new slide here"
        >
            <div className="h-px w-16 bg-pink-400/50"></div>
            <PlusIcon className="w-5 h-5 mx-2 bg-slate-100 dark:bg-slate-900 border-2 border-pink-400/50 rounded-full"/>
            <div className="h-px w-16 bg-pink-400/50"></div>
        </button>
    </div>
);


const OutlinePreview: React.FC<OutlinePreviewProps> = ({ parsedOutline, onEditLayout, onAddSlide, onRemoveSlide }) => {
    return (
        <div className="h-96 overflow-y-auto pr-2 custom-scrollbar bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            {parsedOutline.length > 0 ? (
            <div className="space-y-1">
                <AddSlideButton onClick={() => onAddSlide(0)} />
                {parsedOutline.map((slide, index) => (
                <React.Fragment key={index}>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm animate-fade-in flex items-start gap-6 relative group/slide">
                        <div className="flex-shrink-0">
                            <SlideLayoutWireframe
                                layout={slide.layout}
                                className="group"
                                onClick={() => onEditLayout(index)}
                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEditLayout(index)}
                                role="button"
                                tabIndex={0}
                                aria-label={`Change layout for slide ${index + 1}`}
                            >
                                <p className="text-xs text-center mt-1 text-slate-500 dark:text-slate-400 font-mono group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors" aria-hidden="true">{slide.layout.replace(/_/g, ' ')}</p>
                            </SlideLayoutWireframe>
                        </div>
                        <div className="flex-grow pt-1">
                            <h4 className="font-bold text-pink-600 dark:text-pink-400 flex items-baseline">
                                <span className="text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">{index + 1}</span>
                                <span>{slide.title}</span>
                            </h4>
                            {slide.points.length > 0 && (
                            <ul className="list-disc list-inside mt-3 ml-9 text-slate-700 dark:text-slate-300 text-sm space-y-1">
                                {slide.points.map((point, pIndex) => (
                                <li key={pIndex}>{point}</li>
                                ))}
                            </ul>
                            )}
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemoveSlide(index); }}
                            className="absolute top-2 right-2 p-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-full text-slate-500 hover:bg-red-500 hover:text-white opacity-0 group-hover/slide:opacity-100 transition-all"
                            aria-label={`Remove slide ${index + 1}`}
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <AddSlideButton onClick={() => onAddSlide(index + 1)} />
                </React.Fragment>
                ))}
            </div>
            ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <p>Your outline is empty.</p>
                 <button 
                    onClick={() => onAddSlide(0)}
                    className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add First Slide
                </button>
            </div>
            )}
        </div>
    );
};

export default OutlinePreview;