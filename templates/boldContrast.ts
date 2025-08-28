// FIX: Correct import path for types
import { PresentationTemplate } from '../types/index';
import { commonSlideLayouts } from './common';

export const boldContrastTemplate: PresentationTemplate = {
    id: 'bold-contrast',
    name: 'Bold Contrast',
    preview: {
        backgroundColor: 'bg-gray-900',
        headerColor: 'bg-blue-500',
        titleColor: 'text-blue-400',
        textColor: 'text-gray-300'
    },
    master: {
        title: 'BOLD_CONTRAST_MASTER',
        background: { color: '111827' }, // gray-900
        slideNumber: { x: 12.3, y: 7.1, w: 0.5, h: 0.25, color: '60A5FA', fontSize: 10, align: 'right' }, // blue-400
        objects: [
           // A vertical accent bar on the left side
           { rect: { x: 0, y: 0, w: 0.2, h: '100%', fill: { color: '3B82F6' } } }, // blue-500
        ],
        slideLayouts: commonSlideLayouts('60A5FA', 'D1D5DB'), // blue-400, gray-300
    },
};