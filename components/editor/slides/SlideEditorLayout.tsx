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
  onOpenImageStudio: (id: string) => void;
  onExpandSlide: (id: string) => void;
  onViewSlideHistory: (id: string) => void;
  onFactCheckSlide: (id: string) => void;
  onCritiqueSlide: (slideId: string, imageBase64: string) => void;
  onAdaptAudience: (id: string) => void;
  onReorderSlides: (startIndex: number, endIndex: number) => void;
  generatingSlideId: string | null;
  selectedTemplate: PresentationTemplate;
}

const SlideEditorLayout: React.FC<SlideEditorLayoutProps> = (props) => {
  const { slides, onEditSlide, onStyleSlide, onReorderSlides, generatingSlideId, selectedTemplate } = props;
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(slides.length > 0 ? slides[0].id : null);

  // The slide to display in the main view. Prioritizes the slide being generated.
  const displayedSlideId = generatingSlideId || selectedSlideId;

  const displayedSlide = useMemo(() => slides.find(s => s.id === displayedSlideId) || null, [slides, displayedSlideId]);
  const displayedSlideIndex = useMemo(() => {
    if (!displayedSlideId) return -1;
    return slides.findIndex(s => s.id === displayedSlideId);
  }, [slides, displayedSlideId]);
  
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
                generatingSlideId={generatingSlideId}
                onSelectSlide={setSelectedSlideId}
                onReorderSlides={onReorderSlides}
                onEditSlide={onEditSlide}
                template={selectedTemplate}
            />
            <SlideDetailView
                slide={displayedSlide}
                slideNumber={displayedSlideIndex + 1}
                totalSlides={slides.length}
                onEdit={() => displayedSlide && onEditSlide(displayedSlide.id)}
                onStyle={() => displayedSlide && onStyleSlide(displayedSlide.id)}
                onGenerateNotes={() => displayedSlide && props.onGenerateNotes(displayedSlide.id)}
                onGenerateTakeaway={() => displayedSlide && props.onGenerateTakeaway(displayedSlide.id)}
                onOpenImageStudio={() => displayedSlide && props.onOpenImageStudio(displayedSlide.id)}
                onExpand={() => displayedSlide && props.onExpandSlide(displayedSlide.id)}
                onViewHistory={() => displayedSlide && props.onViewSlideHistory(displayedSlide.id)}
                onFactCheck={() => displayedSlide && props.onFactCheckSlide(displayedSlide.id)}
                onCritiqueDesign={props.onCritiqueSlide}
                onAdaptAudience={() => displayedSlide && props.onAdaptAudience(displayedSlide.id)}
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