// FIX: Correct import path for types
import { Slide, PresentationTemplate } from '../types/index';

declare global {
  interface Window {
    PptxGenJS: any;
  }
}

export const downloadPptx = (slides: Slide[], template: PresentationTemplate, title: string) => {
  if (!window.PptxGenJS) {
    alert("PptxGenJS library is not loaded.");
    return;
  }
  
  const pptx = new window.PptxGenJS();

  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'AI Presentation Designer';
  pptx.company = 'Generated via AI';
  pptx.title = title;

  // Define the master slide based on the template
  pptx.defineSlideMaster(template.master);

  // Add a title slide using a specific layout if available
  const hasTitleLayout = template.master.slideLayouts?.some(l => l.name === 'TITLE_ONLY');
  const titleSlide = pptx.addSlide({ masterName: template.master.title, ...(hasTitleLayout && { layout: 'TITLE_ONLY' }) });
  
  if (hasTitleLayout) {
    titleSlide.addText(title, { placeholder: 'title' });
  } else {
     // Fallback for older templates or different designs
     titleSlide.addText(title, { 
      x: 0, y: '40%', w: '100%', 
      align: 'center', 
      fontSize: 44, 
      bold: true, 
      color: template.master.slideLayouts?.[0]?.objects?.[0]?.placeholder?.formatting?.color || 'FFFFFF'
    });
  }

  // Add content slides
  slides.forEach((slide) => {
    // Determine which layout to use. Fallback to DEFAULT.
    const slideLayout = template.master.slideLayouts?.some(l => l.name === slide.layout) 
        ? slide.layout 
        : 'DEFAULT';
    
    const contentSlide = pptx.addSlide({ masterName: template.master.title, layout: slideLayout });

    // Add content based on available data. PptxGenJS will ignore placeholders that don't exist on the selected layout.
    contentSlide.addText(slide.title, { placeholder: 'title' });
    
    if (slide.bulletPoints && slide.bulletPoints.length > 0) {
      contentSlide.addText(slide.bulletPoints.join('\n'), { placeholder: 'body' });
    }

    if (slide.subtitle) {
      contentSlide.addText(slide.subtitle, { placeholder: 'subtitle' });
    }
    if (slide.mainPoint) {
      contentSlide.addText(slide.mainPoint, { placeholder: 'mainPoint' });
    }
    if (slide.quote) {
      contentSlide.addText(slide.quote, { placeholder: 'quote' });
    }
    if (slide.attribution) {
      contentSlide.addText(slide.attribution, { placeholder: 'attribution' });
    }

    if (slide.subtitle1) {
      contentSlide.addText(slide.subtitle1, { placeholder: 'subtitle1' });
    }
    if (slide.body1 && slide.body1.length > 0) {
      contentSlide.addText(slide.body1.join('\n'), { placeholder: 'body1' });
    }
    if (slide.subtitle2) {
      contentSlide.addText(slide.subtitle2, { placeholder: 'subtitle2' });
    }
    if (slide.body2 && slide.body2.length > 0) {
      contentSlide.addText(slide.body2.join('\n'), { placeholder: 'body2' });
    }

    if (slide.image) {
       contentSlide.addImage({
         data: `data:image/jpeg;base64,${slide.image}`,
         placeholder: 'image',
       });
    }
    
    if (slide.speakerNotes) {
        contentSlide.addNotes(slide.speakerNotes);
    }
  });

  pptx.writeFile({ fileName: `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx` });
};