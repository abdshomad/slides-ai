// FIX: Correct import path for types
import { PresentationTemplate } from '../types/index';
import { commonSlideLayouts } from './common';

export const modernDarkTemplate: PresentationTemplate = {
    id: 'modern-dark',
    name: 'Modern Dark',
    preview: {
      backgroundColor: 'bg-slate-800',
      headerColor: 'bg-pink-600',
      titleColor: 'text-white',
      textColor: 'text-slate-300',
    },
    master: {
      title: 'MODERN_DARK_MASTER',
      background: { color: '1E293B' }, // slate-800
      slideNumber: { x: 12.3, y: 7.1, w: 0.5, h: 0.25, color: 'A9A9A9', fontSize: 10, align: 'right' },
      objects: [
        { rect: { x: 0, y: 0, w: '100%', h: 0.5, fill: { color: 'DB2777' } } },
        { text: {
            text: 'AI Generated Presentation',
            options: { x: 0, y: '96%', w: '100%', align: 'center', fontSize: 10, color: 'A9A9A9' }
        }}
      ],
      slideLayouts: commonSlideLayouts('FFFFFF', 'E5E7EB'),
    },
};