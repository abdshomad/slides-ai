import React, { useState } from 'react';
import { Slide } from '../types';
import { EditIcon, StyleIcon, KeyIcon, NotesIcon } from './icons';
import Loader from './Loader';

interface SlidePreviewProps {
  slide: Slide;
  slideNumber: number;
  onEdit: () => void;
  onStyle: () => void;
  onGenerateTakeaway: () => void;
  onGenerateNotes: () => void;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ slide, slideNumber, onEdit, onStyle, onGenerateTakeaway, onGenerateNotes }) => {
  const [showNotes, setShowNotes] = useState(false);
  
  return (
    <div className="bg-slate-700 rounded-lg shadow-lg h-full flex flex-col group relative transition-all duration-300">
      <div className="relative w-full h-40 bg-slate-800 rounded-t-lg flex items-center justify-center overflow-hidden">
        {slide.isLoadingImage && (
            <div className="flex flex-col items-center text-slate-400">
                <Loader />
                <span className="text-xs mt-2">Generating Image...</span>
            </div>
        )}
        {slide.image && !slide.isLoadingImage && (
          <img src={`data:image/jpeg;base64,${slide.image}`} alt={slide.title} className="w-full h-full object-cover" />
        )}
        {!slide.image && !slide.isLoadingImage && (
             <span className="text-slate-500 text-sm">No Image</span>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-shrink-0 mb-2">
            <h3 className="font-bold text-md text-pink-400 truncate" title={slide.title}>{slide.title}</h3>
            <span className="text-xs text-slate-400">Slide {slideNumber}</span>
        </div>
        <div className="flex-grow overflow-auto text-sm">
            <ul className="list-disc list-inside space-y-1 text-slate-300">
            {slide.bulletPoints.map((point, index) => (
                <li key={index} className="truncate">{point}</li>
            ))}
            {slide.bulletPoints.length === 0 && <li className="text-slate-400">No content</li>}
            </ul>
        </div>
        {slide.keyTakeaway && (
             <div className="mt-3 pt-3 border-t border-slate-600/50">
                <p className="text-xs font-semibold text-purple-300 flex items-start">
                    <KeyIcon className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" />
                    <span className="font-bold">Key Takeaway:</span>
                    <span className="ml-1 font-normal text-slate-300">{slide.keyTakeaway}</span>
                </p>
            </div>
        )}
      </div>

       <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={onEdit}
          className="p-1.5 bg-slate-800/50 text-white rounded-full hover:bg-pink-600 transition-colors"
          aria-label={`Edit slide ${slideNumber}`}
        >
          <EditIcon className="w-4 h-4" />
        </button>
        <button
          onClick={onStyle}
          className="p-1.5 bg-slate-800/50 text-white rounded-full hover:bg-purple-600 transition-colors"
          aria-label={`Change style for slide ${slideNumber}`}
        >
          <StyleIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 pb-4 flex flex-wrap gap-2 text-xs">
         {!slide.keyTakeaway && (
            <button 
                onClick={onGenerateTakeaway} 
                disabled={slide.isGeneratingTakeaway}
                className="flex-grow inline-flex items-center justify-center px-2 py-1.5 bg-purple-600/50 hover:bg-purple-600 rounded-md transition-colors disabled:bg-slate-600 disabled:cursor-wait"
            >
                {slide.isGeneratingTakeaway ? <Loader/> : <KeyIcon className="w-3 h-3 mr-1" />}
                Add Key Takeaway
            </button>
         )}
         
        {slide.isGeneratingNotes ? (
            <div className="flex-grow flex items-center justify-center px-2 py-1.5 bg-slate-600/50 rounded-md">
                <Loader />
                <span className="ml-1">Generating Notes...</span>
            </div>
        ) : slide.speakerNotes ? (
            <button onClick={() => setShowNotes(!showNotes)} className="flex-grow inline-flex items-center justify-center px-2 py-1.5 bg-slate-600/50 hover:bg-slate-600 rounded-md transition-colors">
                <NotesIcon className="w-3 h-3 mr-1" />
                {showNotes ? 'Hide' : 'Show'} Notes
            </button>
        ) : (
            <button 
                onClick={onGenerateNotes} 
                className="flex-grow inline-flex items-center justify-center px-2 py-1.5 bg-slate-600/50 hover:bg-slate-600 rounded-md transition-colors"
            >
                <NotesIcon className="w-3 h-3 mr-1" />
                Generate Notes
            </button>
        )}
      </div>
       {showNotes && slide.speakerNotes && (
        <div className="bg-slate-900/70 p-4 animate-fade-in">
          <h4 className="font-bold text-sm text-purple-300 mb-2 flex items-center">
            <NotesIcon className="w-4 h-4 mr-2" />
            Speaker Notes
          </h4>
          <p className="text-sm text-slate-300 whitespace-pre-wrap">{slide.speakerNotes}</p>
        </div>
      )}

    </div>
  );
};

export default SlidePreview;