import React, { useState } from 'react';
// FIX: Correct import path for types
import { Slide } from '../types/index';
// FIX: Correctly import NotesIcon and consolidate icon imports from the barrel file.
import { KeyIcon, NotesIcon, EditIcon, StyleIcon } from './icons';
import SlideImage from './slide/SlideImage';
import SlidePreviewActions from './slide/SlidePreviewActions';


interface SlidePreviewProps {
  slide: Slide;
  slideNumber: number;
  onEdit: () => void;
  onStyle: () => void;
  onGenerateTakeaway: () => void;
  onGenerateNotes: () => void;
  onGenerateImage: () => void;
  // FIX: Add onSelectImageFromSearch prop to pass to the SlideImage component.
  onSelectImageFromSearch: (slideId: string, url: string) => void;
}

const SlidePreview: React.FC<SlidePreviewProps> = (props) => {
  const { slide, slideNumber, onEdit, onStyle } = props;
  const [showNotes, setShowNotes] = useState(false);
  const validBulletPoints = slide.bulletPoints?.filter(p => p.trim()) || [];
  
  return (
    <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg h-full flex flex-col group relative transition-all duration-300">
      {/* FIX: Pass missing required props to SlideImage to resolve TypeScript error. */}
      <SlideImage 
        isLoading={slide.isLoadingImage}
        image={slide.image}
        title={slide.title}
        imagePrompt={slide.imagePrompt}
        imageSearchResults={slide.imageSearchResults}
        onGenerate={props.onGenerateImage}
        onSelectImage={(url) => props.onSelectImageFromSearch(slide.id, url)}
      />

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-shrink-0 mb-2">
            <h3 className="font-bold text-md text-pink-600 dark:text-pink-400 truncate" title={slide.title}>{slide.title}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Slide {slideNumber}</span>
        </div>
        <div className="flex-grow overflow-auto text-sm">
            {validBulletPoints.length > 0 ? (
              <ul className="custom-bullets space-y-1 text-slate-700 dark:text-slate-300">
                {validBulletPoints.map((point, index) => (
                  <li key={index} className="truncate">{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 italic text-sm pl-5">No content</p>
            )}
        </div>
        {slide.keyTakeaway && (
             <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600/50">
                <div className="text-sm text-purple-600 dark:text-purple-300 flex items-start">
                    <KeyIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="font-bold block">Key Takeaway</span>
                        <p className="mt-1 font-normal text-slate-700 dark:text-slate-300 text-base">{slide.keyTakeaway}</p>
                    </div>
                </div>
            </div>
        )}
      </div>

       <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={onEdit}
          className="p-1.5 bg-slate-100/50 dark:bg-slate-800/50 text-slate-800 dark:text-white rounded-full hover:bg-pink-600 hover:text-white transition-colors"
          aria-label={`Edit slide ${slideNumber}`}
        >
          <EditIcon className="w-4 h-4" />
        </button>
        <button
          onClick={onStyle}
          className="p-1.5 bg-slate-100/50 dark:bg-slate-800/50 text-slate-800 dark:text-white rounded-full hover:bg-purple-600 hover:text-white transition-colors"
          aria-label={`Change style for slide ${slideNumber}`}
        >
          <StyleIcon className="w-4 h-4" />
        </button>
      </div>

      <SlidePreviewActions 
        slide={slide}
        onGenerateNotes={props.onGenerateNotes}
        onGenerateTakeaway={props.onGenerateTakeaway}
        showNotes={showNotes}
        setShowNotes={setShowNotes}
      />
       {showNotes && slide.speakerNotes && (
        <div className="bg-slate-100 dark:bg-slate-900/70 p-4 animate-fade-in">
          <h4 className="font-bold text-sm text-purple-600 dark:text-purple-300 mb-2 flex items-center">
            <NotesIcon className="w-4 h-4 mr-2" />
            Speaker Notes
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{slide.speakerNotes}</p>
        </div>
      )}

    </div>
  );
};

export default SlidePreview;