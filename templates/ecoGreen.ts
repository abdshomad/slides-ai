// FIX: Correct import path for types
import { PresentationTemplate } from '../types/index';
import { commonSlideLayouts } from './common';

export const ecoGreenTemplate: PresentationTemplate = {
    id: 'eco-green',
    name: 'Eco Green',
    preview: {
        backgroundColor: 'bg-green-100',
        headerColor: 'bg-green-600',
        titleColor: 'text-slate-800',
        textColor: 'text-slate-600'
    },
    master: {
        title: 'ECO_GREEN_MASTER',
        background: { color: 'F0FDF4' }, // green-50
        slideNumber: { x: 12.3, y: 7.1, w: 0.5, h: 0.25, color: '475569', fontSize: 10, align: 'right' }, // slate-600
        objects: [
           { rect: { x: '5%', y: '8%', w: '90%', h: 0.05, fill: { color: '16A34A' } } }, // green-600 line near top
           { text: {
                text: 'AI Generated Presentation',
                options: { x: 0, y: '96%', w: '100%', align: 'center', fontSize: 10, color: '94A3B8' } // slate-400
            }}
        ],
        slideLayouts: commonSlideLayouts('14532D', '475569'), // green-900, slate-600
    },
};