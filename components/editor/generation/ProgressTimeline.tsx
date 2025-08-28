import React from 'react';
import { slideGenerationSteps } from '../../../utils/loadingSteps';
import Loader from '../../Loader';

interface ProgressTimelineProps {
    currentLoadingStep: number;
    currentLoadingSubStep: number;
}

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ currentLoadingStep, currentLoadingSubStep }) => {
    return (
        <div className="space-y-6">
            {slideGenerationSteps.map((step, stepIndex) => {
                const isStepCompleted = stepIndex < currentLoadingStep;
                const isStepActive = stepIndex === currentLoadingStep;

                return (
                    <div key={stepIndex} className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isStepCompleted ? 'bg-green-500' : isStepActive ? 'bg-pink-500 animate-pulse' : 'bg-slate-600'}`}>
                                {isStepCompleted ? (
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <span className="font-bold text-white">{stepIndex + 1}</span>
                                )}
                            </div>
                            {stepIndex < slideGenerationSteps.length - 1 && (
                                <div className={`w-0.5 h-20 mt-2 transition-colors duration-500 ${isStepCompleted ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                            )}
                        </div>
                        <div className={`pt-1 flex-1 transition-opacity duration-300 ${isStepCompleted || isStepActive ? 'opacity-100' : 'opacity-50'}`}>
                            <h3 className="text-lg font-semibold text-slate-200">{step.title}</h3>
                            {(isStepCompleted || isStepActive) && (
                                <ul className="mt-2 ml-2 space-y-2 text-slate-400 animate-fade-in">
                                    {step.subSteps.map((subStep, subStepIndex) => {
                                        const isSubStepCompleted = isStepCompleted || (isStepActive && subStepIndex < currentLoadingSubStep);
                                        const isSubStepActive = isStepActive && subStepIndex === currentLoadingSubStep;

                                        return (
                                            <li key={subStepIndex} className="flex items-center text-sm transition-colors duration-300">
                                                {isSubStepCompleted ? (
                                                    <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                                ) : isSubStepActive ? (
                                                    <Loader />
                                                ) : (
                                                    <div className="w-2 h-2 bg-slate-500 rounded-full mr-3 flex-shrink-0"></div>
                                                )}
                                                <span className={`${isSubStepCompleted ? 'text-slate-300' : ''} ${isSubStepActive ? 'text-pink-400' : ''}`}>{subStep}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProgressTimeline;
