// FIX: Correct import path for types
import { PresentationTemplate } from '../types/index';
import { commonSlideLayouts } from './common';

export const corporateClassicTemplate: PresentationTemplate = {
    id: 'corporate-classic',
    name: 'Corporate Classic',
    preview: {
        backgroundColor: 'bg-white',
        headerColor: 'bg-blue-800',
        titleColor: 'text-blue-900',
        textColor: 'text-gray-700'
    },
    master: {
        title: 'CORPORATE_CLASSIC_MASTER',
        background: { color: 'FFFFFF' },
        slideNumber: { x: 12.3, y: 7.1, w: 0.5, h: 0.25, color: '1E3A8A', fontSize: 10, align: 'right' }, // blue-900
        objects: [
           // A solid footer bar
           { rect: { x: 0, y: '92%', w: '100%', h: '8%', fill: { color: '1E40AF' } } }, // blue-800
           { text: {
                text: 'Your Company Name',
                options: { x: 0.5, y: '93%', w: '50%', align: 'left', fontSize: 12, color: 'FFFFFF', bold: true }
           }}
        ],
        slideLayouts: commonSlideLayouts('1E3A8A', '374151'), // blue-900, gray-700
    },
};