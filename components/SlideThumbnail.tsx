import React from 'react';
// FIX: Correct import path for types
import { PresentationTemplate, Slide } from '../types/index';
import { ImageIcon, ChartIcon } from './icons';

interface SlideThumbnailProps {
  template: PresentationTemplate;
  slide?: Slide; // Make it optional for template previews
}

const SlideThumbnail: React.FC<SlideThumbnailProps> = ({ template, slide }) => {
  const isLightBg = template.preview.backgroundColor.includes('white') || template.preview.backgroundColor.includes('green-100');
  
  if (slide?.chartData) {
    return (
      <div className={`w-full h-full ${template.preview.backgroundColor} rounded-md overflow-hidden flex flex-col items-center justify-center p-2`}>
        <ChartIcon className={`w-6 h-6 ${template.preview.titleColor}`} />
        <p className={`${template.preview.textColor} text-[6px] leading-tight mt-1 font-semibold truncate`}>{slide.title}</p>
         <style>{`
          .text-\\[6px\\] { font-size: 6px !important; }
        `}</style>
      </div>
    );
  }

  const layout = slide?.layout || 'DEFAULT';

  const mockSlide = {
    title: 'Slide Title',
    bulletPoints: ['Lorem ipsum dolor sit amet.', 'Consectetur adipiscing elit.', 'Sed do eiusmod tempor.'],
  };

  const title = slide?.title || mockSlide.title;
  const bulletPoints = (slide?.bulletPoints?.length && slide.bulletPoints) || (slide?.body1?.length && slide.body1) || mockSlide.bulletPoints;
  const image = slide?.image;

  const titleEl = <div className={`${template.preview.titleColor} font-bold text-[6px] leading-tight truncate`}>{title}</div>;
  const textEl = (
    <div className={`${template.preview.textColor} text-[5px] leading-tight mt-1 space-y-0.5`}>
      {bulletPoints.slice(0, 3).map((pt, i) => <p key={i} className="truncate">{pt}</p>)}
    </div>
  );
  const imageEl = (
    <div className="w-full h-full">
      {image ? (
        <img src={`data:image/jpeg;base64,${image}`} className="w-full h-full object-cover rounded-sm" alt="Thumbnail"/>
      ) : (
        <div className={`w-full h-full rounded-sm bg-gray-500/20 ${!isLightBg ? 'border border-gray-400/20' : ''} flex items-center justify-center`}>
          <ImageIcon className="w-4 h-4 text-gray-400/60" />
        </div>
      )}
    </div>
  );

  let content;
  switch (layout) {
    case 'ONE_COLUMN_TEXT':
    case 'TIMELINE':
      content = (
        <div className="p-2 w-full">
          {titleEl}
          {textEl}
        </div>
      );
      break;
    case 'TITLE_ONLY':
    case 'SECTION_HEADER':
      content = (
        <div className="p-2 w-full h-full flex flex-col items-center justify-center">
           <div className={`${template.preview.titleColor} font-bold text-[8px] leading-tight truncate text-center`}>{title}</div>
           {layout === 'SECTION_HEADER' && <div className={`${template.preview.textColor} text-[5px] mt-1`}>Subtitle</div>}
        </div>
      );
      break;
    case 'DEFAULT_REVERSE':
      content = (
        <div className="p-2 flex gap-1.5 w-full h-full">
          <div className="w-1/2 h-full">{imageEl}</div>
          <div className="w-1/2 h-full">
            {titleEl}
            {textEl}
          </div>
        </div>
      );
      break;
    case 'DEFAULT':
    default:
      content = (
        <div className="p-2 flex gap-1.5 w-full h-full">
          <div className="w-1/2 h-full">
            {titleEl}
            {textEl}
          </div>
          <div className="w-1/2 h-full">{imageEl}</div>
        </div>
      );
      break;
  }
  
  return (
    <div className={`w-full h-full ${template.preview.backgroundColor} rounded-md overflow-hidden flex flex-col`}>
      {content}
      <style>{`
        /* This is a hack to get tiny fonts working with Tailwind. */
        .text-\\[8px\\] { font-size: 8px !important; }
        .text-\\[6px\\] { font-size: 6px !important; }
        .text-\\[5px\\] { font-size: 5px !important; }
      `}</style>
    </div>
  );
};

export default SlideThumbnail;