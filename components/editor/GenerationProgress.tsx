import React from 'react';
// FIX: Correct import path for types
import { GenerationStats } from '../../types/index';
import { formatTime } from '../../utils/timeUtils';
import StatCard from './generation/StatCard';
import ProgressTimeline from './generation/ProgressTimeline';

interface GenerationProgressProps {
    currentLoadingStep: number;
    currentLoadingSubStep: number;
    stats: GenerationStats;
    elapsedTime: number;
    estimatedTime: number;
}


const GenerationProgress: React.FC<GenerationProgressProps> = ({ currentLoadingStep, currentLoadingSubStep, stats, elapsedTime, estimatedTime }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[60vh]">
            <div className="w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-center text-pink-400 mb-4">Crafting your presentation...</h2>
                
                 <div className="w-full max-w-lg mx-auto mb-6 text-sm text-slate-300">
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="font-semibold inline-block">
                                    Time Elapsed: {formatTime(elapsedTime)}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="font-semibold inline-block">
                                    Estimated: ~{formatTime(estimatedTime)}
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-700">
                            <div style={{ width: `${Math.min(100, (elapsedTime / estimatedTime) * 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500 transition-all duration-1000 ease-linear"></div>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
                    <StatCard label="Sources Analyzed" value={stats.sourcesAnalyzed} />
                    <StatCard label="Slides Created" value={stats.slidesCreated} />
                    <StatCard label="Images Sourced" value={stats.imagesSourced} />
                    <StatCard label="Images to Generate" value={stats.imagesToGenerate} />
                </div>
                
                <ProgressTimeline 
                    currentLoadingStep={currentLoadingStep} 
                    currentLoadingSubStep={currentLoadingSubStep} 
                />
            </div>
        </div>
    );
};

export default GenerationProgress;