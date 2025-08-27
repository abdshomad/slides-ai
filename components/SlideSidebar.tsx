import React from 'react';
import { Slide as SlideType } from '../types';

interface SlideSidebarProps {
  slides: SlideType[];
  selectedSlideId: string | null;
  onSelectSlide: (slideId: string) => void;
}

const SlideSidebar: React.FC<SlideSidebarProps> = ({ slides, selectedSlideId, onSelectSlide }) => {
  return (
    <div className="w-64 flex-shrink-0 h-[75vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          onClick={() => onSelectSlide(slide.id)}
          className={`cursor-pointer rounded-lg border-2 transition-all duration-200 p-2 ${
            selectedSlideId === slide.id ? 'border-pink-500 bg-slate-700/50' : 'border-transparent hover:border-slate-600 bg-slate-700/20'
          }`}
          role="button"
          aria-label={`Select slide ${index + 1}`}
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectSlide(slide.id)}
        >
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-bold w-6 text-center">{index + 1}</span>
            <div className="w-24 h-14 bg-slate-800 rounded-md flex-shrink-0 overflow-hidden relative">
              {slide.image && <img src={`data:image/jpeg;base64,${slide.image}`} className="w-full h-full object-cover" alt="Slide thumbnail"/>}
               {!slide.image && <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-slate-500">No Image</span>}
            </div>
            <p className="text-sm text-slate-300 truncate flex-grow pr-2">{slide.title}</p>
          </div>
        </div>
      ))}
      {slides.length === 0 && <p className="text-slate-500 text-center py-4">No slides generated yet.</p>}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #475569;
          border-radius: 10px;
          border: 3px solid transparent;
        }
      `}</style>
    </div>
  );
};

export default SlideSidebar;