/**
 * Defines a set of common slide layouts that can be reused across different presentation templates.
 * @param titleColor The hex code for the title text color.
 * @param bodyColor The hex code for the body text color.
 * @returns An array of PptxGenJS slide layout objects.
 */
export const commonSlideLayouts = (titleColor: string, bodyColor: string) => [
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
    },
    {
      name: 'ONE_COLUMN_TEXT',
      objects: [
        { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.2, w: '90%', h: 0.8 },
            formatting: { color: titleColor, bold: true, fontSize: 32, align: 'left' } } },
        { placeholder: { options: { name: 'body', type: 'body', x: 0.5, y: 1.2, w: '90%', h: 5.5 },
            formatting: { color: bodyColor, fontSize: 18, bullet: { type: 'dot', indent: 20 } } } },
      ]
    },
    {
      name: 'SECTION_HEADER',
      objects: [
        { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 2.5, w: '90%', h: 1.5 },
            formatting: { color: titleColor, bold: true, fontSize: 44, align: 'center', valign: 'middle' } } },
        { placeholder: { options: { name: 'subtitle', type: 'body', x: 0.5, y: 4.0, w: '90%', h: 1.0 },
            formatting: { color: bodyColor, fontSize: 24, align: 'center', valign: 'top' } } },
      ]
    },
    {
      name: 'MAIN_POINT_EMPHASIS',
      objects: [
        { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.2, w: '90%', h: 0.8 },
            formatting: { color: titleColor, bold: true, fontSize: 24, align: 'left' } } },
        { placeholder: { options: { name: 'mainPoint', type: 'body', x: 0.5, y: 1.5, w: '90%', h: 2.5 },
            formatting: { color: titleColor, bold: true, fontSize: 60, align: 'center', valign: 'middle' } } },
        { placeholder: { options: { name: 'body', type: 'body', x: 0.5, y: 4.5, w: '90%', h: 2.0 },
            formatting: { color: bodyColor, fontSize: 18, align: 'center', valign: 'top' } } },
      ]
    },
    {
      name: 'QUOTE',
      objects: [
        { placeholder: { options: { name: 'quote', type: 'body', x: 1.0, y: 1.0, w: 11.3, h: 4.5 },
            formatting: { color: titleColor, fontSize: 32, align: 'center', valign: 'middle', italic: true } } },
        { placeholder: { options: { name: 'attribution', type: 'body', x: 1.0, y: 5.5, w: 11.3, h: 1.0 },
            formatting: { color: bodyColor, fontSize: 20, align: 'right', bold: true } } },
      ]
    },
    {
      name: 'TWO_COLUMN_TEXT',
      objects: [
        { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.2, w: '90%', h: 0.8 },
            formatting: { color: titleColor, bold: true, fontSize: 32, align: 'center' } } },
        { placeholder: { options: { name: 'body1', type: 'body', x: 0.5, y: 1.2, w: 6, h: 5.5 },
            formatting: { color: bodyColor, fontSize: 16, bullet: { type: 'dot', indent: 20 } } } },
        { placeholder: { options: { name: 'body2', type: 'body', x: 6.8, y: 1.2, w: 6, h: 5.5 },
            formatting: { color: bodyColor, fontSize: 16, bullet: { type: 'dot', indent: 20 } } } },
      ]
    },
    {
      name: 'COMPARISON',
      objects: [
        { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.2, w: '90%', h: 0.8 },
            formatting: { color: titleColor, bold: true, fontSize: 32, align: 'center' } } },
        { placeholder: { options: { name: 'subtitle1', type: 'body', x: 0.5, y: 1.2, w: 6, h: 0.5 },
            formatting: { color: titleColor, bold: true, fontSize: 20, align: 'center' } } },
        { placeholder: { options: { name: 'body1', type: 'body', x: 0.5, y: 1.8, w: 6, h: 4.9 },
            formatting: { color: bodyColor, fontSize: 16, bullet: { type: 'dot', indent: 20 } } } },
        { placeholder: { options: { name: 'subtitle2', type: 'body', x: 6.8, y: 1.2, w: 6, h: 0.5 },
            formatting: { color: titleColor, bold: true, fontSize: 20, align: 'center' } } },
        { placeholder: { options: { name: 'body2', type: 'body', x: 6.8, y: 1.8, w: 6, h: 4.9 },
            formatting: { color: bodyColor, fontSize: 16, bullet: { type: 'dot', indent: 20 } } } },
      ]
    },
    {
      name: 'TIMELINE',
      objects: [
        { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.2, w: '90%', h: 0.8 },
            formatting: { color: titleColor, bold: true, fontSize: 32, align: 'left' } } },
        { placeholder: { options: { name: 'body', type: 'body', x: 0.5, y: 1.2, w: '90%', h: 5.5 },
            formatting: { color: bodyColor, fontSize: 18, bullet: { type: 'dot', indent: 20 } } } },
      ]
    }
  ];
