// FIX: Correct import path for types
import { PresentationTemplate } from '../types/index';
import { commonSlideLayouts } from './common';

export const sunsetWarmthTemplate: PresentationTemplate = {
    id: 'sunset-warmth',
    name: 'Sunset Warmth',
    preview: {
        backgroundColor: 'bg-amber-800',
        headerColor: 'bg-red-500',
        titleColor: 'text-white',
        textColor: 'text-amber-100'
    },
    master: {
        title: 'SUNSET_WARMTH_MASTER',
        background: { color: '92400E' }, // amber-800
        slideNumber: { x: 12.3, y: 7.1, w: 0.5, h: 0.25, color: 'FEF3C7', fontSize: 10, align: 'right' }, // amber-100
        objects: [
           { rect: { x: 0, y: 0, w: '100%', h: 0.5, fill: { color: 'EF4444' } } }, // red-500
        ],
        slideLayouts: commonSlideLayouts('FFFFFF', 'FEF3C7'), // white, amber-100
    },
};