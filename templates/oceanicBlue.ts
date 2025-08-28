// FIX: Correct import path for types
import { PresentationTemplate } from '../types/index';
import { commonSlideLayouts } from './common';

export const oceanicBlueTemplate: PresentationTemplate = {
    id: 'oceanic-blue',
    name: 'Oceanic Blue',
    preview: {
        backgroundColor: 'bg-sky-700',
        headerColor: 'bg-teal-400',
        titleColor: 'text-white',
        textColor: 'text-sky-100'
    },
    master: {
        title: 'OCEANIC_BLUE_MASTER',
        background: { color: '0369A1' }, // sky-700
        slideNumber: { x: 12.3, y: 7.1, w: 0.5, h: 0.25, color: 'E0F2FE', fontSize: 10, align: 'right' }, // sky-100
        objects: [
           { rect: { x: 0, y: '95%', w: '100%', h: 0.2, fill: { color: '2DD4BF' } } }, // teal-400
        ],
        slideLayouts: commonSlideLayouts('FFFFFF', 'E0F2FE'), // white, sky-100
    },
};