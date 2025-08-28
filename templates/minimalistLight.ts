// FIX: Correct import path for types
import { PresentationTemplate } from '../types/index';
import { commonSlideLayouts } from './common';

export const minimalistLightTemplate: PresentationTemplate = {
    id: 'minimalist-light',
    name: 'Minimalist Light',
    preview: {
        backgroundColor: 'bg-gray-100',
        headerColor: 'bg-gray-400',
        titleColor: 'text-gray-800',
        textColor: 'text-gray-600'
    },
    master: {
        title: 'MINIMALIST_LIGHT_MASTER',
        background: { color: 'F9FAFB' }, // gray-100
        slideNumber: { x: 12.3, y: 7.1, w: 0.5, h: 0.25, color: '6B7280', fontSize: 10, align: 'right' }, // gray-500
        objects: [
           { rect: { x: 0, y: '96%', w: '100%', h: 0.05, fill: { color: 'D1D5DB' } } }, // gray-300 thin line
        ],
        slideLayouts: commonSlideLayouts('1F2937', '4B5563'), // gray-800, gray-600
    },
};