import React from 'react';
// FIX: Correct import path for types
import { Slide as SlideType, GenerationStats, PresentationTemplate } from '../../types/index';
import SlidesStepHeader from './slides/SlidesStepHeader';
import AsyncTaskIndicator from './slides/AsyncTaskIndicator';
import SlideEditorLayout from './slides/SlideEditorLayout';

interface SlidesStepProps {
  slides: SlideType[];
  isLoading: boolean;
  loadingMessage: string;
  onDownload: () => void;
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
  currentLoadingStep: number;
  currentLoadingSubStep: number;
  generationStats: GenerationStats;
  elapsedTime: number;
  estimatedTime: number;
  selectedTemplate: PresentationTemplate;
}

const SlidesStep: React.FC<SlidesStepProps> = (props) => {
  const {
    slides,
    isLoading,
    loadingMessage,
    onDownload,
    elapsedTime,
    estimatedTime,
  } = props;

  return (
    <div className="mt-8 animate-fade-in">
      <SlidesStepHeader 
        showDownloadButton={slides.length > 0 && !isLoading}
        onDownload={onDownload}
      />
      
      <AsyncTaskIndicator
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        elapsedTime={elapsedTime}
        estimatedTime={estimatedTime}
      />

      <SlideEditorLayout {...props} />
    </div>
  );
};

export default SlidesStep;