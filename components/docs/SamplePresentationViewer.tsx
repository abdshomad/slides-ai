import React from 'react';
import { samplePresentation } from '../../slides/samplePresentation';
import SlideEditorLayout from '../editor/slides/SlideEditorLayout';
import { templates } from '../../templates/index';
import { ArrowLeftIcon, DownloadIcon } from '../icons';

const SamplePresentationViewer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // A dummy function to satisfy the component's prop requirements. It does nothing.
    const doNothing = () => {};

    // FIX: Corrected the props object to match the SlideEditorLayoutProps interface.
    // Added the missing 'onOpenImageStudio' prop and removed extraneous ones.
    const props = {
        slides: samplePresentation,
        onEditSlide: doNothing,
        onStyleSlide: doNothing,
        onGenerateNotes: doNothing,
        onGenerateTakeaway: doNothing,
        onExpandSlide: doNothing,
        onViewSlideHistory: doNothing,
        onFactCheckSlide: doNothing,
        onCritiqueSlide: doNothing,
        onAdaptAudience: doNothing,
        onReorderSlides: doNothing,
        onOpenImageStudio: doNothing,
        selectedTemplate: templates[0],
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-800/60 hover:bg-slate-300 dark:hover:bg-slate-700/80 px-3 py-1.5 rounded-md transition-colors border border-slate-300 dark:border-slate-700/50">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to App
                </button>
                 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Sample Presentation</h2>
                 <button
                    data-tour-id="export-button"
                    onClick={doNothing}
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition-colors"
                    >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download PPTX
                </button>
            </div>
            
            <SlideEditorLayout {...props} />
        </div>
    );
};

export default SamplePresentationViewer;