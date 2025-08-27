// This file defines the presentation templates available to the user.
// Each template object contains:
// - id: A unique identifier.
// - name: The user-facing name of the template.
// - preview: A set of TailwindCSS classes to generate a visual preview in the UI.
// - master: A PptxGenJS slide master definition, now including `slideLayouts` which define content placeholders for various slide designs.

import { PresentationTemplate } from './types';

const commonSlideLayouts = (titleColor: string, bodyColor: string) => [
  {
    name: 'DEFAULT', // Image right
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.2, w: '90%', h: 0.8 },
          formatting: { color: titleColor, bold: true, fontSize: 28, align: 'center' } } },
      { placeholder: { options: { name: 'body', type: 'body', x: 0.5, y: 1.2, w: 5.8, h: 4.5 },
          formatting: { color: bodyColor, fontSize: 16, bullet: { type: 'dot', indent: 20 } } } },
      { placeholder: { options: { name: 'image', type: 'pic', x: 6.8, y: 1.2, w: 6, h: 4.5 } } },
    ]
  },
  {
    name: 'DEFAULT_REVERSE', // Image left
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.2, w: '90%', h: 0.8 },
          formatting: { color: titleColor, bold: true, fontSize: 28, align: 'center' } } },
      { placeholder: { options: { name: 'image', type: 'pic', x: 0.5, y: 1.2, w: 6, h: 4.5 } } },
      { placeholder: { options: { name: 'body', type: 'body', x: 7, y: 1.2, w: 5.8, h: 4.5 },
          formatting: { color: bodyColor, fontSize: 16, bullet: { type: 'dot', indent: 20 } } } },
    ]
  },
  {
    name: 'TITLE_ONLY',
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 2.5, w: '90%', h: 1.5, align: 'center' },
          formatting: { color: titleColor, bold: true, fontSize: 44, align: 'center', valign: 'middle' } } },
    ]
  }
];


export const templates: PresentationTemplate[] = [
  {
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
      background: { color: '1F2937' },
      objects: [
        { rect: { x: 0, y: 0, w: '100%', h: 0.5, fill: { color: 'DB2777' } } },
        { text: {
            text: 'AI Generated Presentation',
            options: { x: 0, y: '96%', w: '100%', align: 'center', fontSize: 10, color: 'A9A9A9' }
        }}
      ],
      slideLayouts: commonSlideLayouts('FFFFFF', 'E5E7EB'),
    },
  },
  {
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
  },
  {
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
        objects: [
           { rect: { x: 0, y: '95%', w: '100%', h: 0.2, fill: { color: 'FACC15' } } },
        ],
        slideLayouts: commonSlideLayouts('FFFFFF', 'D8B4FE'),
    },
  }
];