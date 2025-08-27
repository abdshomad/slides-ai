import React from 'react';
import { Source } from '../../types';
import ToneSelector from '../ToneSelector';
import TemplateSelector from '../TemplateSelector';
import Loader from '../Loader';
import { MagicIcon, ResearchIcon } from '../icons';

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
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-200 mb-4">Generated Outline</h2>
      <p className="text-slate-400 mb-4">Review the outline, choose a tone and design template, then generate the full presentation.</p>
      <textarea
        value={outline}
        onChange={(e) => setOutline(e.target.value)}
        className="w-full h-64 p-4 bg-slate-900/50 border border-slate-600 rounded-md resize-y font-mono text-sm"
        aria-label="Generated presentation outline"
      />
      {sources.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-slate-300 mb-2">Sources Used:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-pink-400">
            {sources.map((source, index) => (
              <li key={index}>
                <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="hover:underline" title={source.web.uri}>
                  {source.web.title || source.web.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ToneSelector selectedTone={tone} onToneChange={setTone} />
        <TemplateSelector 
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={setSelectedTemplateId}
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button onClick={onGenerateSlides} disabled={isLoading || !selectedTemplateId} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-slate-500 disabled:cursor-not-allowed">
           {isLoading ? <><Loader />{loadingMessage}</> : <><MagicIcon className="w-5 h-5 mr-2" />Approve & Create Slides</>}
        </button>
        <button onClick={onRegenerateOutline} disabled={isLoading} className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-medium rounded-md text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50">
          <ResearchIcon className="w-5 h-5 mr-2" />Regenerate Outline
        </button>
      </div>
    </div>
  );
};

export default OutlineStep;