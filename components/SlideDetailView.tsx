import React, { useState, useRef, useCallback } from 'react';
// FIX: Correct import path for types
import { Slide as SlideType } from '../types/index';
import SlideActionToolbar from './SlideActionToolbar';
import SlideContent from './slide/SlideContent';
import SlideImage from './slide/SlideImage';
import SlideMetadata from './slide/SlideMetadata';
import useSlideExport from '../hooks/useSlideExport';
import SlideChart from './SlideChart';


interface SlideDetailViewProps {
  slide: SlideType | null;
  slideNumber: number;
  totalSlides: number;
  onEdit: () => void;
  onStyle: () => void;
  onGenerateTakeaway: () => void;
  onGenerateNotes: () => void;
  onExpand: () => void;
  onViewHistory: () => void;
  onGenerateImage: () => void;
  onFactCheck: () => void;
  onCritiqueDesign: (slideId: string, imageBase64: string) => void;
  onSelectImageFromSearch: (slideId: string, url: string) => void;
}

const SlideDetailView: React.FC<SlideDetailViewProps> = (props) => {
  const { slide, slideNumber, totalSlides, onSelectImageFromSearch } = props;
  const [showNotes, setShowNotes] = useState(false);
  const slideContentRef = useRef<HTMLDivElement>(null);
  const { isExporting, exportSlide, captureSlideAsBase64 } = useSlideExport(slideContentRef, slide, slideNumber);

  if (!slide) {
    return (
        <div className="flex-grow h-[75vh] flex items-center justify-center bg-slate-200 dark:bg-slate-800/50 rounded-lg">
            <p className="text-slate-500 dark:text-slate-400">Select a slide to view details</p>
        </div>
    );
  }

  const handleCritique = useCallback(async () => {
    if (!slide) return;
    try {
      const imageData = await captureSlideAsBase64(); // uses default pixel ratio
      props.onCritiqueDesign(slide.id, imageData);
    } catch (error) {
      console.error("Failed to capture slide for critique:", error);
      // Ideally show an error toast to the user
    }
  }, [slide, captureSlideAsBase64, props.onCritiqueDesign]);
  
  return (
    <div className="flex-grow h-[75vh] flex flex-col bg-slate-100 dark:bg-slate-700/30 rounded-lg shadow-lg">
        <div ref={slideContentRef} className="flex-grow flex flex-col overflow-hidden relative">
             {/* Conditionally hide SlideImage if a chart is present */}
            {!slide.chartData && (
                <SlideImage
                  isLoading={slide.isLoadingImage}
                  image={slide.image}
                  title={slide.title}
                  imagePrompt={slide.imagePrompt}
                  imageSearchResults={slide.imageSearchResults}
                  onGenerate={props.onGenerateImage}
                  onSelectImage={(url) => onSelectImageFromSearch(slide.id, url)}
                />
            )}
             {slideNumber > 0 && (
                <div className="absolute top-3 right-3 bg-white/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md px-2 py-1 backdrop-blur-sm">
                    {slideNumber} / {totalSlides}
                </div>
            )}
            
            <div className="p-6 flex-grow flex flex-col overflow-y-auto custom-scrollbar">
                {/* Render title here */}
                <div className={`flex items-center mb-4 ${slide.layout === 'TITLE_ONLY' ? 'justify-center h-full' : ''}`}>
                   {slide.layout !== 'TITLE_ONLY' && <div className="w-1 h-8 bg-pink-400 rounded-full mr-4 flex-shrink-0"></div>}
                    <h3 className={`font-bold text-pink-600 dark:text-pink-400 ${slide.layout === 'TITLE_ONLY' ? 'text-5xl text-center' : 'text-2xl'}`}>{slide.title}</h3>
                </div>
                
                {/* Render Chart or SlideContent */}
                {slide.chartData ? (
                    <div className="w-full h-96 flex-grow">
                        <SlideChart chartData={slide.chartData} />
                    </div>
                ) : (
                    <SlideContent slide={slide} />
                )}
                <SlideMetadata slide={slide} showNotes={showNotes} />
            </div>
        </div>
        <SlideActionToolbar 
            slide={slide}
            onEdit={props.onEdit}
            onStyle={props.onStyle}
            onGenerateTakeaway={props.onGenerateTakeaway}
            onGenerateNotes={props.onGenerateNotes}
            onExpand={props.onExpand}
            onViewHistory={props.onViewHistory}
            onGenerateImage={props.onGenerateImage}
            onFactCheck={props.onFactCheck}
            onCritiqueDesign={handleCritique}
            onExportSlide={exportSlide}
            isExporting={isExporting}
            showNotes={showNotes}
            setShowNotes={setShowNotes}
        />
         <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
          border: 3px solid transparent;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #475569;
        }
      `}</style>
    </div>
  );
};

export default SlideDetailView;