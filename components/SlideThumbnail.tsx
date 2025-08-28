import React from 'react';
// FIX: Correct import path for types
import { PresentationTemplate, Slide } from '../types/index';
import { ImageIcon, ChartIcon } from './icons';

interface SlideThumbnailProps {
  template: PresentationTemplate;
  slide?: Slide;
}

// Helper to convert pptx units to CSS percentages
const PptxUnitConverter = {
  slideWidth: 13.333,
  slideHeight: 7.5,
  toPercent(value: number | string, dimension: 'w' | 'h'): string {
    if (typeof value === 'string' && value.endsWith('%')) {
      return value;
    }
    const total = dimension === 'w' ? this.slideWidth : this.slideHeight;
    return `${(Number(value) / total) * 100}%`;
  },
};

const TextBlock: React.FC<{ colorClass: string; lines: number; className?: string }> = ({
  colorClass,
  lines,
  className = '',
}) => (
  <div className={`space-y-0.5 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <div
        key={i}
        className={`h-0.5 rounded-full ${colorClass} opacity-50 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
      />
    ))}
  </div>
);

const SlideThumbnail: React.FC<SlideThumbnailProps> = ({ template, slide }) => {
  if (slide?.chartData) {
    return (
      <div className={`w-full h-full ${template.preview.backgroundColor} rounded-md overflow-hidden flex flex-col items-center justify-center p-2 shadow-inner border border-black/10`}>
        <ChartIcon className={`w-6 h-6 ${template.preview.titleColor}`} />
        <p className={`${template.preview.textColor} text-[6px] leading-tight mt-1 font-semibold truncate`}>{slide.title}</p>
      </div>
    );
  }

  const layout = slide?.layout || 'DEFAULT';

  const mockSlide = {
    title: 'Template Title',
    bulletPoints: ['Key point one.', 'Key point two.', 'Key point three.'],
    subtitle: 'Section Subtitle',
    mainPoint: '95%',
    quote: '"A compelling quote about the topic."',
    attribution: 'A.I. Source',
    subtitle1: 'Concept A',
    body1: ['Detail A1', 'Detail A2'],
    subtitle2: 'Concept B',
    body2: ['Detail B1', 'Detail B2'],
  };

  const image = slide?.image;
  const { backgroundColor, headerColor, textColor } = template.preview;
  const textColorAsBg = textColor.replace('text-', 'bg-');

  const titleEl = (
    <div className={`h-1.5 w-3/4 rounded-full ${headerColor} opacity-90`} />
  );

  const imageEl = (
    <div className="w-full h-full">
      {image ? (
        <img src={`data:image/jpeg;base64,${image}`} className="w-full h-full object-cover rounded-sm" alt="Thumbnail" />
      ) : (
        <div className="w-full h-full rounded-sm bg-black/10 flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-black/20" />
        </div>
      )}
    </div>
  );

  const createTextList = (points: string[]) => (
    <TextBlock colorClass={textColorAsBg} lines={points.slice(0, 3).length} />
  );

  let content;
  switch (layout) {
    case 'ONE_COLUMN_TEXT':
    case 'TIMELINE': {
      const bulletPoints = slide?.bulletPoints?.length ? slide.bulletPoints : mockSlide.bulletPoints;
      content = (
        <div className="p-2 w-full space-y-1.5">
          {titleEl}
          {createTextList(bulletPoints)}
        </div>
      );
      break;
    }
    case 'TITLE_ONLY':
    case 'SECTION_HEADER': {
      content = (
        <div className="p-2 w-full h-full flex flex-col items-center justify-center text-center space-y-1.5">
          <div className={`h-2 w-5/6 rounded-full ${headerColor} opacity-90`} />
          {layout === 'SECTION_HEADER' && <div className={`h-1.5 w-1/2 rounded-full ${textColorAsBg} opacity-70`} />}
        </div>
      );
      break;
    }
    case 'DEFAULT_REVERSE': {
      const bulletPoints = slide?.bulletPoints?.length ? slide.bulletPoints : mockSlide.bulletPoints;
      content = (
        <div className="p-2 flex gap-1.5 w-full h-full items-center">
          <div className="w-1/2 h-4/5">{imageEl}</div>
          <div className="w-1/2 h-full space-y-1.5 pt-1">
            {titleEl}
            {createTextList(bulletPoints)}
          </div>
        </div>
      );
      break;
    }
    case 'TWO_COLUMN_TEXT': {
      const body1 = slide?.body1?.length ? slide.body1 : mockSlide.body1;
      const body2 = slide?.body2?.length ? slide.body2 : mockSlide.body2;
      content = (
        <div className="p-2 flex flex-col w-full h-full">
          <div className="self-center mb-1.5">{titleEl}</div>
          <div className="flex gap-1.5 flex-grow">
            <div className="w-1/2">{createTextList(body1)}</div>
            <div className="w-1/2">{createTextList(body2)}</div>
          </div>
        </div>
      );
      break;
    }
    case 'MAIN_POINT_EMPHASIS': {
      const bulletPoints = slide?.bulletPoints?.length ? slide.bulletPoints : mockSlide.bulletPoints;
      content = (
        <div className="p-2 w-full h-full flex flex-col space-y-1">
          {titleEl}
          <div className="flex-grow flex items-center justify-center">
            <div className={`h-3 w-1/2 rounded ${headerColor} opacity-90`} />
          </div>
          {bulletPoints.length > 0 && <div className="self-center w-5/6"><TextBlock colorClass={textColorAsBg} lines={1} /></div>}
        </div>
      );
      break;
    }
    case 'QUOTE': {
      content = (
        <div className="p-2 w-full h-full flex flex-col items-center justify-center text-center space-y-1.5">
          <TextBlock colorClass={textColorAsBg} lines={2} className="w-5/6" />
          <div className={`h-1 w-1/3 self-end rounded-full ${headerColor} opacity-80`} />
        </div>
      );
      break;
    }
    case 'COMPARISON': {
      const body1 = slide?.body1?.length ? slide.body1 : mockSlide.body1;
      const body2 = slide?.body2?.length ? slide.body2 : mockSlide.body2;
      content = (
        <div className="p-2 flex flex-col w-full h-full">
          <div className="self-center mb-1.5">{titleEl}</div>
          <div className="flex gap-1.5 flex-grow">
            <div className="w-1/2 space-y-1">
              <div className={`h-1 w-2/3 rounded-full ${headerColor} opacity-70`} />
              {createTextList(body1)}
            </div>
            <div className="w-1/2 space-y-1">
              <div className={`h-1 w-2/3 rounded-full ${headerColor} opacity-70`} />
              {createTextList(body2)}
            </div>
          </div>
        </div>
      );
      break;
    }
    case 'DEFAULT':
    default: {
      const bulletPoints = slide?.bulletPoints?.length ? slide.bulletPoints : mockSlide.bulletPoints;
      content = (
        <div className="p-2 flex gap-1.5 w-full h-full items-center">
          <div className="w-1/2 h-full space-y-1.5 pt-1">
            {titleEl}
            {createTextList(bulletPoints)}
          </div>
          <div className="w-1/2 h-4/5">{imageEl}</div>
        </div>
      );
      break;
    }
  }

  return (
    <div className={`w-full h-full ${backgroundColor} rounded-md overflow-hidden relative isolate border border-black/10 shadow-md`}>
      {/* Master Slide Elements */}
      {template.master.objects?.map((obj, i) => {
        if (obj.rect) {
          const { x, y, w, h, fill } = obj.rect;
          const style = {
            position: 'absolute' as const,
            left: PptxUnitConverter.toPercent(x, 'w'),
            top: PptxUnitConverter.toPercent(y, 'h'),
            width: PptxUnitConverter.toPercent(w, 'w'),
            height: PptxUnitConverter.toPercent(h, 'h'),
            backgroundColor: `#${fill.color}`,
          };
          return <div key={`master-obj-${i}`} style={style} />;
        }
        if (obj.line) {
          const { x, y, w, h, line } = obj.line;
          const style = {
            position: 'absolute' as const,
            left: PptxUnitConverter.toPercent(x, 'w'),
            top: PptxUnitConverter.toPercent(y, 'h'),
            width: PptxUnitConverter.toPercent(w, 'w'),
            height: h === 0 ? `${line.width || 1}px` : PptxUnitConverter.toPercent(h, 'h'),
            backgroundColor: `#${line.color}`,
          };
          return <div key={`master-obj-${i}`} style={style} />;
        }
        return null;
      })}

      {/* Content Layer */}
      <div className="absolute inset-0 flex flex-col z-10">{content}</div>

      {/* Slide Number */}
      {template.master.slideNumber && (
        <div
          className="absolute z-20 text-[4px] font-sans font-bold"
          style={{
            left: PptxUnitConverter.toPercent(template.master.slideNumber.x, 'w'),
            top: PptxUnitConverter.toPercent(template.master.slideNumber.y, 'h'),
            color: `#${template.master.slideNumber.color}`,
          }}
        >
          #
        </div>
      )}
      
      <style>{`
        .text-\\[6px\\] { font-size: 6px !important; }
      `}</style>
    </div>
  );
};
export default SlideThumbnail;
