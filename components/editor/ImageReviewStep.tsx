import React from 'react';
import { MagicIcon } from '../icons/MagicIcon';

interface ImageReviewStepProps {
  images: { url: string; title: string; }[];
  onContinue: () => void;
}

const ImageReviewStep: React.FC<ImageReviewStepProps> = ({ images, onContinue }) => {
  return (
    <div className="animate-fade-in text-center py-8">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Visuals Sourced by AI</h2>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
        During research, the AI found these high-quality, royalty-free images that might be a good fit for your presentation. They've been added as suggestions to the relevant slides.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[40vh] overflow-y-auto p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-lg custom-scrollbar">
        {images.map((image, index) => (
          <div key={index} className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-md overflow-hidden group relative">
            <img src={image.url} alt={image.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold truncate" title={image.title}>
              {image.title}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="mt-8 inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all transform hover:scale-105"
      >
        <MagicIcon className="w-6 h-6 mr-3" />
        Continue to Editor
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
      `}</style>
    </div>
  );
};

export default ImageReviewStep;
