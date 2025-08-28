import React from 'react';
import { ParsedSlide } from '../../../utils/outlineParser';
import SlideLayoutWireframe from '../SlideLayoutWireframe';

interface OutlinePreviewProps {
    parsedOutline: ParsedSlide[];
    onEditLayout: (index: number) => void;
}

const OutlinePreview: React.FC<OutlinePreviewProps> = ({ parsedOutline, onEditLayout }) => {
    return (
        <div className="h-96 overflow-y-auto pr-2 custom-scrollbar bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            {parsedOutline.length > 0 ? (
            <div className="space-y-4">
                {parsedOutline.map((slide, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm animate-fade-in flex items-start gap-6">
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
                </div>
                ))}
            </div>
            ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
                <p>Your generated outline will appear here.</p>
            </div>
            )}
        </div>
    );
};

export default OutlinePreview;