import React from 'react';
// FIX: Correct import path for types
import { Slide as SlideType } from '../../types/index';
import { KeyIcon, NotesIcon } from '../icons';

interface SlideMetadataProps {
    slide: SlideType;
    showNotes: boolean;
}

const SlideMetadata: React.FC<SlideMetadataProps> = ({ slide, showNotes }) => {
    const hasMetadata = slide.keyTakeaway || (showNotes && slide.speakerNotes);
    if (!hasMetadata) return null;

    return (
        <>
            {slide.keyTakeaway && (
                <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600/50">
                    <div className="text-md text-purple-600 dark:text-purple-300 flex items-start">
                        <KeyIcon className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                        <h4 className="font-bold">Key Takeaway</h4>
                    </div>
                    <p className="mt-2 text-lg text-slate-800 dark:text-slate-200 pl-6">{slide.keyTakeaway}</p>
                </div>
            )}
            {showNotes && slide.speakerNotes && (
                <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600/50 bg-slate-200/50 dark:bg-slate-900/50 p-4 rounded-md">
                    <h4 className="font-bold text-md text-purple-600 dark:text-purple-300 mb-2 flex items-center">
                        <NotesIcon className="w-5 h-5 mr-2" />
                        Speaker Notes
                    </h4>
                    <p className="text-md text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{slide.speakerNotes}</p>
                </div>
            )}
        </>
    );
};

export default SlideMetadata;