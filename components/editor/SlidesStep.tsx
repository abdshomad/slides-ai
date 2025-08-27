import React from 'react';
import { Slide as SlideType } from '../../types';
import Loader from '../Loader';
import SlideSidebar from '../SlideSidebar';
import SlideDetailView from '../SlideDetailView';
import { DownloadIcon } from '../icons';

interface SlidesStepProps {
  slides: SlideType[];
  isLoading: boolean;
  loadingMessage: string;
  selectedSlideId: string | null;
  onSelectSlide: (id: string) => void;
  onDownload: () => void;
  onEditSlide: (id: string) => void;
  onStyleSlide: (id: string) => void;
  onGenerateNotes: (id: string) => void;
  onGenerateTakeaway: (id: string) => void;
  onExpandSlide: (id: string) => void;
  onViewHistory: (id: string) => void;
  onGenerateImage: (id: string) => void;
}

const SlidesStep: React.FC<SlidesStepProps> = ({
  slides,
  isLoading,
  loadingMessage,
  selectedSlideId,
  onSelectSlide,
  onDownload,
  onEditSlide,
  onStyleSlide,
  onGenerateNotes,
  onGenerateTakeaway,
  onExpandSlide,
  onViewHistory,
  onGenerateImage,
}) => {
  const selectedSlide = React.useMemo(() => slides.find(s => s.id === selectedSlideId), [slides, selectedSlideId]);

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex justify-end items-center mb-6">
          {slides.length > 0 && !isLoading && (
              <button
                onClick={onDownload}
                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition-colors"
              >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download PPTX
              </button>
          )}
      </div>

       {(isLoading && slides.length === 0) && (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <Loader />
            <p className="mt-4 text-slate-400">{loadingMessage}</p>
        </div>
      )}

      {slides.length > 0 && (
        <div className="flex gap-8">
          <SlideSidebar 
              slides={slides}
              selectedSlideId={selectedSlideId}
              onSelectSlide={onSelectSlide}
          />
          <SlideDetailView
              slide={selectedSlide || null}
              onEdit={() => selectedSlideId && onEditSlide(selectedSlideId)}
              onStyle={() => selectedSlideId && onStyleSlide(selectedSlideId)}
              onGenerateNotes={() => selectedSlideId && onGenerateNotes(selectedSlideId)}
              onGenerateTakeaway={() => selectedSlideId && onGenerateTakeaway(selectedSlideId)}
              onExpand={() => selectedSlideId && onExpandSlide(selectedSlideId)}
              onViewHistory={() => selectedSlideId && onViewHistory(selectedSlideId)}
              onGenerateImage={() => selectedSlideId && onGenerateImage(selectedSlideId)}
              isLoading={isLoading && loadingMessage.includes('Expanding')}
          />
        </div>
      )}
    </div>
  );
};

export default SlidesStep;