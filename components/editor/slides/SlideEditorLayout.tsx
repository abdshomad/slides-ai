import React, { useState, useMemo, useEffect } from 'react';
// FIX: Correct import path for types
import { Slide as SlideType, PresentationTemplate } from '../../../types/index';
import SlideSidebar from '../../SlideSidebar';
import SlideDetailView from '../../SlideDetailView';

interface SlideEditorLayoutProps {
  slides: SlideType[];
  onEditSlide: (id: string) => void;
  onStyleSlide: (id: string) => void;
  onGenerateNotes: (id: string) => void;
  onGenerateTakeaway: (id: string) => void;
  onGenerateImage: (id: string) => void;
  onExpandSlide: (id: string) => void;
  onViewSlideHistory: (id: string) => void;
  onFactCheckSlide: (id: string) => void;
  onCritiqueSlide: (slideId: string, imageBase64: string) => void;
  onReorderSlides: (startIndex: number, endIndex: number) => void;
  onSelectImageFromSearch: (slideId: string, url: string) => void;
  selectedTemplate: PresentationTemplate;
}

const SlideEditorLayout: React.FC<SlideEditorLayoutProps> = (props) => {
  const { slides, onEditSlide, onStyleSlide, onReorderSlides, selectedTemplate } = props;
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(slides.length > 0 ? slides[0].id : null);

  const selectedSlide = useMemo(() => slides.find(s => s.id === selectedSlideId) || null, [slides, selectedSlideId]);
  const selectedSlideIndex = useMemo(() => {
    if (!selectedSlideId) return -1;
    return slides.findIndex(s => s.id === selectedSlideId);
  }, [slides, selectedSlideId]);
  
  // Update selected slide if it's deleted or on first load
  useEffect(() => {
    if (slides.length > 0 && !slides.some(s => s.id === selectedSlideId)) {
      setSelectedSlideId(slides[0].id);
    } else if (slides.length > 0 && !selectedSlideId) {
      setSelectedSlideId(slides[0].id);
    } else if (slides.length === 0) {
      setSelectedSlideId(null);
    }
  }, [slides, selectedSlideId]);

  return (
    <>
      {slides.length > 0 ? (
        <div className="flex gap-8">
            <SlideSidebar
                slides={slides}
                selectedSlideId={selectedSlideId}
                onSelectSlide={setSelectedSlideId}
                onReorderSlides={onReorderSlides}
                onEditSlide={onEditSlide}
                template={selectedTemplate}
            />
            <SlideDetailView
                slide={selectedSlide}
                slideNumber={selectedSlideIndex + 1}
                totalSlides={slides.length}
                onEdit={() => selectedSlide && onEditSlide(selectedSlide.id)}
                onStyle={() => selectedSlide && onStyleSlide(selectedSlide.id)}
                onGenerateNotes={() => selectedSlide && props.onGenerateNotes(selectedSlide.id)}
                onGenerateTakeaway={() => selectedSlide && props.onGenerateTakeaway(selectedSlide.id)}
                onGenerateImage={() => selectedSlide && props.onGenerateImage(selectedSlide.id)}
                onExpand={() => selectedSlide && props.onExpandSlide(selectedSlide.id)}
                onViewHistory={() => selectedSlide && props.onViewSlideHistory(selectedSlide.id)}
                onFactCheck={() => selectedSlide && props.onFactCheckSlide(selectedSlide.id)}
                onCritiqueDesign={props.onCritiqueSlide}
                onSelectImageFromSearch={props.onSelectImageFromSearch}
            />
        </div>
      ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
            <h3 className="text-xl font-semibold text-slate-500 dark:text-slate-400">No Slides</h3>
            <p className="text-slate-400 dark:text-slate-500 mt-2">There are no slides in this presentation yet.</p>
        </div>
      )}
    </>
  );
};

export default SlideEditorLayout;