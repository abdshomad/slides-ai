import React, { useState } from 'react';
import { Slide } from '../../types/index';
import { MagicIcon, VideoIcon } from '../icons';
import Loader from '../Loader';

interface VideoTabProps {
    slide: Slide;
    onGenerateVideo: (slideId: string, prompt: string) => void;
    onClose: () => void;
}

const VideoTab: React.FC<VideoTabProps> = ({ slide, onGenerateVideo, onClose }) => {
    const [prompt, setPrompt] = useState(slide.videoPrompt || `A short, dynamic video about: ${slide.title}`);

    const handleGenerate = () => {
        onGenerateVideo(slide.id, prompt);
        onClose();
    };
    
    if (slide.isGeneratingVideo) {
        return (
            <div className="text-center py-10 h-48 flex flex-col items-center justify-center">
                <div className="flex items-center text-lg font-semibold">
                    <Loader />
                    <span className="ml-3">Generating Video...</span>
                </div>
                <p className="mt-3 text-slate-500 dark:text-slate-400">{slide.videoGenerationProgress || "Please wait, this may take a few minutes."}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="video-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Video Prompt</label>
                <textarea
                    id="video-prompt"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="e.g., A neon hologram of a cat driving at top speed"
                    className="w-full h-24 p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-pink-500"
                />
            </div>
             <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-sm text-slate-600 dark:text-slate-400">
                <p><strong>Note:</strong> Video generation is an intensive process and may take several minutes to complete. The slide will show a loading indicator while the AI works.</p>
            </div>
            <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-slate-500 font-semibold"
            >
                <VideoIcon className="w-5 h-5 mr-2" /> Generate Video
            </button>
        </div>
    );
};

export default VideoTab;