import React, { useState, useRef, useCallback } from 'react';
// FIX: Correct import path for types
import { Slide as SlideType } from '../types/index';
import SlideContent from './slide/SlideContent';
import SlideMetadata from './slide/SlideMetadata';
import useSlideExport from '../hooks/useSlideExport';
import SlideChart from './SlideChart';
import ImageEditor from './slide/ImageEditor';
import { ActionMenu } from './slide/actions/ActionMenu';


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
  onFactCheck: () => void;
  onCritiqueDesign: (slideId: string, imageBase64: string) => void;
  onAdaptAudience: () => void;
  onOpenImageStudio: (slideId: string) => void;
}

const SlideDetailView: React.FC<SlideDetailViewProps> = (props) => {
  const { slide, slideNumber, totalSlides, onOpenImageStudio } = props;
  const [showNotes, setShowNotes] = useState(false);
  const slideContentRef = useRef<HTMLDivElement>(null);
  const { captureSlideAsBase64 } = useSlideExport(slideContentRef, slide, slideNumber);

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

  const hasImage = !['ONE_COLUMN_TEXT', 'TITLE_ONLY', 'SECTION_HEADER', 'QUOTE', 'TWO_COLUMN_TEXT', 'TIMELINE', 'COMPARISON'].includes(slide.layout || '');

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
                <div className={`flex flex-col ${hasImage ? 'w-1/2' : 'w-full'}`}>
                    <SlideContent slide={slide} />
                </div>
                {hasImage && (
                    <div className="w-1/2">
                        <ImageEditor
                            slide={slide}
                            onOpenImageStudio={() => onOpenImageStudio(slide.id)}
                        />
                    </div>
                )}
            </div>
        )}
        
        <SlideMetadata slide={slide} showNotes={showNotes} />
      </div>

      <ActionMenu
        slide={slide}
        onEdit={props.onEdit}
        onStyle={props.onStyle}
        onGenerateTakeaway={props.onGenerateTakeaway}
        onGenerateNotes={props.onGenerateNotes}
        onExpand={props.onExpand}
        onViewHistory={props.onViewHistory}
        onGenerateImage={() => onOpenImageStudio(slide.id)}
        onFactCheck={props.onFactCheck}
        onCritiqueDesign={handleCritique}
        onAdaptAudience={props.onAdaptAudience}
        showNotes={showNotes}
        setShowNotes={setShowNotes}
      />
    </div>
  );
};

export default SlideDetailView;