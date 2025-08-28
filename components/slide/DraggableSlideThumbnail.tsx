import React from 'react';
import { Slide as SlideType, PresentationTemplate } from '../../types/index';
import { EditIcon, ChartIcon } from '../icons';
import SlideThumbnail from '../SlideThumbnail';

interface DraggableSlideThumbnailProps {
    slide: SlideType;
    template: PresentationTemplate;
    index: number;
    isSelected: boolean;
    isBeingDragged: boolean;
    isDragTarget: boolean;
    onSelectSlide: (slideId: string) => void;
    onEditSlide: (slideId: string) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnter: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

const DraggableSlideThumbnail: React.FC<DraggableSlideThumbnailProps> = (props) => {
    const {
        slide, template, index, isSelected, isBeingDragged, isDragTarget,
        onSelectSlide, onEditSlide,
        onDragStart, onDragOver, onDragEnter, onDragLeave, onDrop, onDragEnd
    } = props;
    
    return (
        <div
            onClick={() => onSelectSlide(slide.id)}
            className={`cursor-pointer rounded-lg border-2 transition-all duration-200 p-2 relative group ${
                isSelected && !isBeingDragged ? 'border-pink-500 bg-slate-200/50 dark:bg-slate-700/50' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600 bg-slate-100/50 dark:bg-slate-700/20'
            } ${isBeingDragged ? 'opacity-40' : ''} ${isDragTarget ? 'ring-2 ring-pink-400' : ''}`}
            role="button"
            aria-label={`Select slide ${index + 1}. Draggable.`}
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectSlide(slide.id)}
            draggable="true"
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDragEnter={(e) => onDragEnter(e, index)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, index)}
            onDragEnd={onDragEnd}
        >
            <div className="flex items-center gap-3 pointer-events-none">
                <span className="text-slate-500 dark:text-slate-400 font-bold w-6 text-center">{index + 1}</span>
                <div className="w-24 h-14 rounded-md flex-shrink-0 overflow-hidden">
                    <SlideThumbnail template={template} slide={slide} />
                </div>
                <div className="flex-grow pr-2 overflow-hidden">
                    <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{slide.title}</p>
                     {slide.chartData && (
                        <div className="flex items-center mt-1 text-xs text-purple-600 dark:text-purple-400 font-semibold">
                           <ChartIcon className="w-3 h-3 mr-1.5" />
                           <span>Chart</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditSlide(slide.id);
                    }}
                    className="p-1.5 bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white rounded-full hover:bg-pink-600 hover:text-white transition-colors"
                    aria-label={`Edit slide ${index + 1}: ${slide.title}`}
                >
                    <EditIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default DraggableSlideThumbnail;