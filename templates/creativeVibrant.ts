// FIX: Correct import path for types
import { PresentationTemplate } from '../types/index';
import { commonSlideLayouts } from './common';

export const creativeVibrantTemplate: PresentationTemplate = {
    id: 'creative-vibrant',
    name: 'Creative Vibrant',
    preview: {
        backgroundColor: 'bg-purple-800',
        headerColor: 'bg-yellow-400',
        titleColor: 'text-white',
        textColor: 'text-purple-200'
    },
    master: {
        title: 'CREATIVE_VIBRANT_MASTER',
        background: { color: '5B21B6' },
        slideNumber: { x: 12.3, y: 7.1, w: 0.5, h: 0.25, color: 'D8B4FE', fontSize: 10, align: 'right' },
        objects: [
           { rect: { x: 0, y: '95%', w: '100%', h: 0.2, fill: { color: 'FACC15' } } },
        ],
        slideLayouts: commonSlideLayouts('FFFFFF', 'D8B4FE'),
    },
};