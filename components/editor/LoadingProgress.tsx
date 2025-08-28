import React from 'react';
import { formatTime } from '../../utils/timeUtils';

interface LoadingProgressProps {
    elapsedTime: number;
    estimatedTime: number;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({ elapsedTime, estimatedTime }) => {
    if (estimatedTime <= 0) return null;

    const progress = Math.min(100, (elapsedTime / estimatedTime) * 100);

    return (
        <div className="w-full max-w-xs mx-auto mt-2 text-sm text-slate-400">
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="font-semibold inline-block">
                            Time Elapsed: {formatTime(elapsedTime)}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="font-semibold inline-block">
                            Est: ~{formatTime(estimatedTime)}
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
                    <div 
                        style={{ width: `${progress}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500 transition-all duration-1000 ease-linear"
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingProgress;
