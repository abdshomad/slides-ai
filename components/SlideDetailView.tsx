import React, { useState } from 'react';
import { Slide as SlideType } from '../types';
import { KeyIcon, NotesIcon } from './icons';
import Loader from './Loader';
import SlideActionToolbar from './SlideActionToolbar';

interface SlideDetailViewProps {
  slide: SlideType | null;
  onEdit: () => void;
  onStyle: () => void;
  onGenerateTakeaway: () => void;
  onGenerateNotes: () => void;
  onExpand: () => void;
  onViewHistory: () => void;
  onGenerateImage: () => void;
  isLoading: boolean;
}

const SlideDetailView: React.FC<SlideDetailViewProps> = (props) => {
  const { slide } = props;
  const [showNotes, setShowNotes] = useState(false);

  if (!slide) {
    return (
        <div className="flex-grow h-[75vh] flex items-center justify-center bg-slate-800/50 rounded-lg">
            <p className="text-slate-400">Select a slide to view details</p>
        </div>
    );
  }
  
  return (
    <div className="flex-grow h-[75vh] flex flex-col bg-slate-700/30 rounded-lg shadow-lg">
        <div className="relative w-full h-1/2 bg-slate-800 rounded-t-lg flex items-center justify-center overflow-hidden">
            {slide.isLoadingImage && (
                <div className="flex flex-col items-center text-slate-400">
                    <Loader />
                    <span className="text-xs mt-2">Generating Image...</span>
                </div>
            )}
            {slide.image && !slide.isLoadingImage && (
            <img src={`data:image/jpeg;base64,${slide.image}`} alt={slide.title} className="w-full h-full object-contain" />
            )}
            {!slide.image && !slide.isLoadingImage && (
                <span className="text-slate-500 text-lg">No Image</span>
            )}
        </div>
        
        <div className="p-6 flex-grow flex flex-col overflow-y-auto custom-scrollbar">
            <h3 className="font-bold text-2xl text-pink-400 mb-4">{slide.title}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-300 text-lg">
            {slide.bulletPoints.map((point, index) => (
                <li key={index}>{point}</li>
            ))}
            {slide.bulletPoints.length === 0 && <li className="text-slate-400">No content</li>}
            </ul>

            {slide.keyTakeaway && (
                <div className="mt-4 pt-4 border-t border-slate-600/50">
                    <p className="text-md font-semibold text-purple-300 flex items-start">
                        <KeyIcon className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                        <span className="font-bold">Key Takeaway:</span>
                        <span className="ml-2 font-normal text-slate-300">{slide.keyTakeaway}</span>
                    </p>
                </div>
            )}
            {showNotes && slide.speakerNotes && (
                <div className="mt-4 pt-4 border-t border-slate-600/50 bg-slate-900/50 p-4 rounded-md">
                    <h4 className="font-bold text-md text-purple-300 mb-2 flex items-center">
                        <NotesIcon className="w-5 h-5 mr-2" />
                        Speaker Notes
                    </h4>
                    <p className="text-md text-slate-300 whitespace-pre-wrap">{slide.speakerNotes}</p>
                </div>
            )}
        </div>

        <SlideActionToolbar 
            {...props}
            showNotes={showNotes}
            setShowNotes={setShowNotes}
        />
    </div>
  );
};

export default SlideDetailView;