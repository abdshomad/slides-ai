import React from 'react';
import { templates } from '../templates/index';
// FIX: Correct import path for types
import { PresentationTemplate } from '../types/index';
import TemplatePreview from './TemplatePreview';

interface TemplateSelectorProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (id: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplateId, onSelectTemplate }) => {
  return (
    <div className="mt-8 animate-fade-in">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Choose a Design Template</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {templates.map((template: PresentationTemplate) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`cursor-pointer rounded-lg border-2 transition-all duration-200 transform hover:-translate-y-1 bg-white dark:bg-slate-800 ${
              selectedTemplateId === template.id ? 'border-pink-500 shadow-lg shadow-pink-500/20' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
            }`}
            role="radio"
            aria-checked={selectedTemplateId === template.id}
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectTemplate(template.id)}
          >
            <TemplatePreview template={template} />
            <div className="p-3">
              <p className="text-center text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{template.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;