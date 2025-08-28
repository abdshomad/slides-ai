

// FIX: Correct import path for types
import { Slide, PresentationTemplate, BrandKit } from '../types/index';

declare global {
  interface Window {
    PptxGenJS: any;
  }
}

const applyBranding = (template: PresentationTemplate, brandKit: BrandKit): PresentationTemplate => {
    // Deep copy to avoid modifying the original template object
    const brandedTemplate = JSON.parse(JSON.stringify(template));
    
    const { logo, primaryColor, secondaryColor, primaryFont, secondaryFont } = brandKit;

    // Apply colors and fonts
    const primaryColorHex = primaryColor.substring(1);
    const secondaryColorHex = secondaryColor.substring(1);

    brandedTemplate.master.slideLayouts.forEach((layout: any) => {
        layout.objects.forEach((obj: any) => {
            if (obj.placeholder) {
                const name = obj.placeholder.options.name;
                const formatting = obj.placeholder.formatting || {};
                
                if (['title', 'subtitle1', 'subtitle2', 'mainPoint'].includes(name)) {
                    formatting.color = primaryColorHex;
                    formatting.fontFace = primaryFont;
                } else if (['body', 'body1', 'body2', 'quote', 'attribution', 'subtitle'].includes(name)) {
                    formatting.color = secondaryColorHex;
                    formatting.fontFace = secondaryFont;
                }
                obj.placeholder.formatting = formatting;
            }
        });
    });

    // Apply branding to the title slide fallback if necessary
    const titleLayout = brandedTemplate.master.slideLayouts?.find((l:any) => l.name === 'TITLE_ONLY');
    if (titleLayout?.objects?.[0]?.placeholder?.formatting) {
        titleLayout.objects[0].placeholder.formatting.color = primaryColorHex;
    }

    // Add logo to the master slide
    if (logo) {
      if (!brandedTemplate.master.objects) {
        brandedTemplate.master.objects = [];
      }
      brandedTemplate.master.objects.push({
        image: {
          data: logo, // data URL string
          x: 12.3, y: 0.2, w: 0.8, h: 0.8 // Top right corner
        }
      });
    }

    return brandedTemplate;
};


export const downloadPptx = (slides: Slide[], template: PresentationTemplate, title: string, brandKit: BrandKit) => {
  if (!window.PptxGenJS) {
    alert("PptxGenJS library is not loaded.");
    return;
  }
  
  const finalTemplate = applyBranding(template, brandKit);
  const pptx = new window.PptxGenJS();

  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'AI Presentation Designer';
  pptx.company = 'Generated via AI';
  pptx.title = title;

  // Define the master slide based on the template
  pptx.defineSlideMaster(finalTemplate.master);

  // Add a title slide using a specific layout if available
  const hasTitleLayout = finalTemplate.master.slideLayouts?.some(l => l.name === 'TITLE_ONLY');
  const titleSlide = pptx.addSlide({ masterName: finalTemplate.master.title, ...(hasTitleLayout && { layout: 'TITLE_ONLY' }) });
  
  if (hasTitleLayout) {
    titleSlide.addText(title, { placeholder: 'title' });
  } else {
     // Fallback for older templates or different designs
     titleSlide.addText(title, { 
      x: 0, y: '40%', w: '100%', 
      align: 'center', 
      fontSize: 44, 
      bold: true, 
      color: finalTemplate.master.slideLayouts?.[0]?.objects?.[0]?.placeholder?.formatting?.color || 'FFFFFF'
    });
  }

  // Add content slides
  slides.forEach((slide) => {
    // Determine which layout to use. Fallback to DEFAULT.
    const slideLayout = finalTemplate.master.slideLayouts?.some(l => l.name === slide.layout) 
        ? slide.layout 
        : 'DEFAULT';
    
    const contentSlide = pptx.addSlide({ masterName: finalTemplate.master.title, layout: slideLayout });

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
