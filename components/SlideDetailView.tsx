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
  onAdaptAudience: () => void;
  onSelectImageFromSearch: (slideId: string, url: string) => void;
  onGenerateImageSuggestions: (slideId: string) => void;
  onSelectImageSuggestion: (slideId: string, suggestion: string) => void;
  onClearSelectedImage: (slideId: string) => void;
}

const SlideDetailView: React.FC<SlideDetailViewProps> = (props) => {
  const { slide, slideNumber, totalSlides, onSelectImageFromSearch } = props;
  const [showNotes, setShowNotes] = useState(false);
  const slideContentRef = useRef<HTMLDivElement>(null);
  const { isExporting, exportSlide, captureSlideAsBase64 } = useSlideExport(slideContentRef, slide, slideNumber);

  const handleCritique = useCallback(async () => {
    if (!slide) return;
    try {
      const imageBase64 = await captureSlideAsBase64();
      props.onCritiqueDesign(slide.id, imageBase64);
    } catch (error) {
      console.error("Failed to capture slide for critique:", error);
    }
  }, [slide, captureSlideAsBase64, props.onCritiqueDesign]);

  if (!slide) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-lg">
        <p className="text-slate-500">Select a slide to view it</p>
      </div>
    );
  }

  const hasContent = slide.bulletPoints?.length > 0 || slide.body1?.length > 0 || slide.body2?.length > 0;
  const hasImage = slide.image || (slide.imageSearchResults && slide.imageSearchResults.length > 0) || slide.imagePrompt || slide.imageSuggestions;

  const getLayoutClass = () => {
    switch (slide.layout) {
      case 'DEFAULT':
        return 'flex-row';
      case 'DEFAULT_REVERSE':
        return 'flex-row-reverse';
      case 'TITLE_ONLY':
      case 'SECTION_HEADER':
      case 'MAIN_POINT_EMPHASIS':
      case 'QUOTE':
        return 'flex-col justify-center text-center';
      default:
        return 'flex-col';
    }
  };

  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700/50">
      <div ref={slideContentRef} className="flex-grow p-8 flex flex-col">
        <div className="flex justify-between items-baseline">
          <h2 className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-6 flex-grow">{slide.title}</h2>
          <span className="text-sm text-slate-400 dark:text-slate-500 flex-shrink-0">{slideNumber} / {totalSlides}</span>
        </div>
        
        {slide.chartData ? (
            <div className="flex-grow w-full h-[400px]">
                <SlideChart chartData={slide.chartData} />
            </div>
        ) : (
            <div className={`flex-grow flex gap-8 ${getLayoutClass()}`}>
                {(hasContent || !hasImage) && (
                    <div className={`flex flex-col ${(hasImage && (slide.layout === 'DEFAULT' || slide.layout === 'DEFAULT_REVERSE')) ? 'w-1/2' : 'w-full'}`}>
                        <SlideContent slide={slide} />
                    </div>
                )}
                {hasImage && !['ONE_COLUMN_TEXT', 'TITLE_ONLY', 'SECTION_HEADER', 'QUOTE', 'TWO_COLUMN_TEXT', 'TIMELINE', 'COMPARISON'].includes(slide.layout || '') && (
                    <div className="w-1/2">
                        <SlideImage
                            slide={slide}
                            // FIX: Pass the required 'title' prop to SlideImage.
                            title={slide.title}
                            onGenerate={() => props.onGenerateImage()}
                            onSelectImage={(url) => onSelectImageFromSearch(slide.id, url)}
                            onGenerateSuggestions={() => props.onGenerateImageSuggestions(slide.id)}
                            onSelectSuggestion={(suggestion) => props.onSelectImageSuggestion(slide.id, suggestion)}
                            onClearSelectedImage={() => props.onClearSelectedImage(slide.id)}
                            onCustomPrompt={props.onEdit}
                        />
                    </div>
                )}
            </div>
        )}
        
        <SlideMetadata slide={slide} showNotes={showNotes} />
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
        onAdaptAudience={props.onAdaptAudience}
        onExportSlide={exportSlide}
        isExporting={isExporting}
        showNotes={showNotes}
        setShowNotes={setShowNotes}
      />
    </div>
  );
};

export default SlideDetailView;