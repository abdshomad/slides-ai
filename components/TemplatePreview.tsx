import React from 'react';
// FIX: Correct import path for types
import { PresentationTemplate } from '../types/index';
import SlideThumbnail from './SlideThumbnail';

interface TemplatePreviewProps {
  template: PresentationTemplate;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template }) => {
  return (
    <div className="w-full aspect-[16/9] rounded-t-md overflow-hidden">
        <SlideThumbnail template={template} />
    </div>
  );
};

export default TemplatePreview;