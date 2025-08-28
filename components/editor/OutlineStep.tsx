import React, { useMemo, useState } from 'react';
// FIX: Correct import path for types
import { Source } from '../../types/index';
import ToneSelector from '../ToneSelector';
import TemplateSelector from '../TemplateSelector';
import { parseOutline } from '../../utils/outlineParser';
import OutlineLayoutSelectorModal from './OutlineLayoutSelectorModal';
import OutlinePreview from './outline/OutlinePreview';
import OutlineEditor from './outline/OutlineEditor';
import SourceList from './outline/SourceList';
import OutlineActions from './outline/OutlineActions';
import { DiagramIcon, ListIcon } from '../icons';
import OutlineDiagram from './outline/OutlineDiagram';
import { updateLayoutInOutline, addSlideToOutline, removeSlideFromOutline } from '../../utils/outlineUtils';

interface OutlineStepProps {
  outline: string;
  setOutline: (outline: string) => void;
  sources: Source[];
  tone: string;
  setTone: (tone: string) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  onGenerateSlides: () => void;
  onRegenerateOutline: () => void;
  isLoading: boolean;
  loadingMessage: string;
}

const OutlineStep: React.FC<OutlineStepProps> = ({
  outline,
  setOutline,
  sources,
  tone,
  setTone,
  selectedTemplateId,
  setSelectedTemplateId,
  onGenerateSlides,
  onRegenerateOutline,
  isLoading,
  loadingMessage,
}) => {
  const [editingLayoutIndex, setEditingLayoutIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'diagram'>('list');
  const parsedOutline = useMemo(() => parseOutline(outline), [outline]);

  const handleUpdateLayout = (slideIndex: number, newLayout: string) => {
    const newOutline = updateLayoutInOutline(outline, slideIndex, newLayout);
    setOutline(newOutline);
  };
  
  const handleAddSlide = (slideIndex: number) => {
    const newOutline = addSlideToOutline(outline, slideIndex);
    setOutline(newOutline);
  };

  const handleRemoveSlide = (slideIndex: number) => {
    if (window.confirm('Are you sure you want to remove this slide from the outline?')) {
        const newOutline = removeSlideFromOutline(outline, slideIndex);
        setOutline(newOutline);
    }
  };


  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Fine-Tune Your Presentation Plan</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Edit the outline text on the left and see a live preview of the slide structure on the right. When you're happy, choose a tone and template to proceed.</p>
      
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <OutlineEditor outline={outline} setOutline={setOutline} />
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Live Preview</h3>
                <div className="flex gap-1 p-0.5 bg-slate-200 dark:bg-slate-700/50 rounded-md">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-2 py-1 text-xs rounded-md flex items-center gap-1.5 transition-colors ${viewMode === 'list' ? 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300/70 dark:hover:bg-slate-700'}`}
                        aria-pressed={viewMode === 'list'}
                    >
                        <ListIcon className="w-4 h-4" />
                        List
                    </button>
                    <button
                        onClick={() => setViewMode('diagram')}
                        className={`px-2 py-1 text-xs rounded-md flex items-center gap-1.5 transition-colors ${viewMode === 'diagram' ? 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300/70 dark:hover:bg-slate-700'}`}
                        aria-pressed={viewMode === 'diagram'}
                    >
                        <DiagramIcon className="w-4 h-4" />
                        Diagram
                    </button>
                </div>
            </div>
            {viewMode === 'list' ? (
                 <OutlinePreview 
                    parsedOutline={parsedOutline} 
                    onEditLayout={setEditingLayoutIndex}
                    onAddSlide={handleAddSlide}
                    onRemoveSlide={handleRemoveSlide}
                />
            ) : (
                <OutlineDiagram parsedOutline={parsedOutline} />
            )}
        </div>
      </div>

      <SourceList sources={sources} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ToneSelector selectedTone={tone} onToneChange={setTone} />
        <TemplateSelector 
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={setSelectedTemplateId}
        />
      </div>

      <OutlineActions
        onGenerateSlides={onGenerateSlides}
        onRegenerateOutline={onRegenerateOutline}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        canGenerateSlides={!!selectedTemplateId && parsedOutline.length > 0}
        slideCount={parsedOutline.length}
      />
      
      {editingLayoutIndex !== null && (
        <OutlineLayoutSelectorModal
          onClose={() => setEditingLayoutIndex(null)}
          onSave={(newLayout) => {
            handleUpdateLayout(editingLayoutIndex, newLayout);
            setEditingLayoutIndex(null);
          }}
          currentLayout={parsedOutline[editingLayoutIndex]?.layout || 'ONE_COLUMN_TEXT'}
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
          border: 3px solid transparent;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #475569;
        }
      `}</style>
    </div>
  );
};

export default OutlineStep;