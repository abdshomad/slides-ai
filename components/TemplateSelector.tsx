import React from 'react';
import { templates } from '../templates';
import { PresentationTemplate } from '../types';

interface TemplateSelectorProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (id: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplateId, onSelectTemplate }) => {
  return (
    <div className="mt-8 animate-fade-in">
      <h3 className="text-xl font-bold text-slate-200 mb-4">Choose a Design Template</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {templates.map((template: PresentationTemplate) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`cursor-pointer rounded-lg border-2 transition-all duration-200 transform hover:-translate-y-1 ${
              selectedTemplateId === template.id ? 'border-pink-500 shadow-lg shadow-pink-500/20' : 'border-slate-600 hover:border-slate-400'
            }`}
            role="radio"
            aria-checked={selectedTemplateId === template.id}
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectTemplate(template.id)}
          >
            <div className={`p-4 rounded-t-md ${template.preview.backgroundColor}`}>
              <div className={`w-full h-3 rounded-sm ${template.preview.headerColor} mb-3`}></div>
              <div className={`w-3/4 h-2 rounded-sm ${template.preview.titleColor.replace('text-', 'bg-')} mb-2`}></div>
              <div className={`w-full h-1.5 rounded-sm ${template.preview.textColor.replace('text-', 'bg-')} mb-1`}></div>
              <div className={`w-5/6 h-1.5 rounded-sm ${template.preview.textColor.replace('text-', 'bg-')}`}></div>
            </div>
            <div className="bg-slate-700 p-2 rounded-b-md">
              <p className="text-center text-sm font-semibold text-slate-300">{template.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
