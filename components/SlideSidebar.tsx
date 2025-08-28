import React, { useState } from 'react';
// FIX: Correct import path for types
import { Slide as SlideType, PresentationTemplate } from '../types/index';
import DraggableSlideThumbnail from './slide/DraggableSlideThumbnail';

interface SlideSidebarProps {
  slides: SlideType[];
  selectedSlideId: string | null;
  onSelectSlide: (slideId: string) => void;
  onReorderSlides: (startIndex: number, endIndex: number) => void;
  onEditSlide: (slideId: string) => void;
  template: PresentationTemplate;
}

const SlideSidebar: React.FC<SlideSidebarProps> = ({ slides, selectedSlideId, onSelectSlide, onReorderSlides, onEditSlide, template }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }
    onReorderSlides(draggedIndex, dropIndex);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="w-64 flex-shrink-0 h-[75vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
      {slides.map((slide, index) => (
        <DraggableSlideThumbnail
          key={slide.id}
          slide={slide}
          template={template}
          index={index}
          isSelected={selectedSlideId === slide.id}
          isBeingDragged={draggedIndex === index}
          isDragTarget={dragOverIndex === index}
          onSelectSlide={onSelectSlide}
          onEditSlide={onEditSlide}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        />
      ))}
      {slides.length === 0 && <p className="text-slate-400 dark:text-slate-500 text-center py-4">No slides generated yet.</p>}
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

export default SlideSidebar;