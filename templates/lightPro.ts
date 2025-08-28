// FIX: Correct import path for types
import { PresentationTemplate } from '../types/index';
import { commonSlideLayouts } from './common';

export const lightProTemplate: PresentationTemplate = {
    id: 'light-pro',
    name: 'Light Professional',
    preview: {
        backgroundColor: 'bg-white',
        headerColor: 'bg-blue-600',
        titleColor: 'text-slate-800',
        textColor: 'text-slate-600'
    },
    master: {
        title: 'LIGHT_PRO_MASTER',
        background: { color: 'FFFFFF' },
        slideNumber: { x: 12.3, y: 7.1, w: 0.5, h: 0.25, color: '6c6c6c', fontSize: 10, align: 'right' },
        objects: [
            { rect: { x: 0, y: 0, w: '100%', h: 0.5, fill: { color: '2563EB' } } },
            { line: { x: 0.5, y: 5.0, w: 12.3, h: 0, line: { color: 'F1F1F1', width: 1 } } },
             { text: {
                text: 'AI Generated Presentation',
                options: { x: 0, y: '96%', w: '100%', align: 'center', fontSize: 10, color: 'B0B0B0' }
            }}
        ],
        slideLayouts: commonSlideLayouts('0F172A', '334155'),
    },
};