import React from 'react';
// FIX: Correct import path for types
import { Slide as SlideType } from '../../types/index';

interface SlideContentProps {
    slide: SlideType;
}

const SlideContent: React.FC<SlideContentProps> = ({ slide }) => {
    const validBulletPoints = slide.bulletPoints?.filter(p => p.trim()) || [];
    const validBody1 = slide.body1?.filter(p => p.trim()) || [];
    const validBody2 = slide.body2?.filter(p => p.trim()) || [];

    const renderDefaultContent = () => (
        <>
            {validBulletPoints.length > 0 ? (
                <ul className="custom-bullets space-y-2 text-slate-700 dark:text-slate-300 text-lg">
                {validBulletPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                ))}
                </ul>
            ) : (
                <p className="text-slate-500 dark:text-slate-400 text-lg italic pl-5">No content to display for this layout.</p>
            )}
        </>
    );

    const renderContent = () => {
        switch (slide.layout) {
            case 'SECTION_HEADER':
                return slide.subtitle ? (
                    <h2 className="text-3xl text-slate-600 dark:text-slate-400 text-center">{slide.subtitle}</h2>
                ) : null;
            case 'MAIN_POINT_EMPHASIS':
                return (
                     <div className="text-center">
                        {slide.mainPoint && <p className="text-6xl font-bold text-purple-600 dark:text-purple-300 mb-4">{slide.mainPoint}</p>}
                        {renderDefaultContent()}
                    </div>
                );
            case 'QUOTE':
                 return (
                    <blockquote className="text-center">
                        {slide.quote && <p className="text-3xl italic text-slate-700 dark:text-slate-300">"{slide.quote}"</p>}
                        {slide.attribution && <cite className="block text-xl text-slate-500 dark:text-slate-400 mt-4 not-italic">&mdash; {slide.attribution}</cite>}
                    </blockquote>
                );
            case 'COMPARISON':
                return (
                    <div className="flex gap-6">
                        <div className="w-1/2">
                            {slide.subtitle1 && <h4 className="font-semibold text-xl text-purple-600 dark:text-purple-300 mb-2">{slide.subtitle1}</h4>}
                            {validBody1.length > 0 && (
                                <ul className="custom-bullets space-y-2 text-slate-700 dark:text-slate-300 text-lg">
                                    {validBody1.map((point, index) => <li key={`col1-${index}`}>{point}</li>)}
                                </ul>
                            )}
                        </div>
                        <div className="w-1/2">
                            {slide.subtitle2 && <h4 className="font-semibold text-xl text-purple-600 dark:text-purple-300 mb-2">{slide.subtitle2}</h4>}
                             {validBody2.length > 0 && (
                                <ul className="custom-bullets space-y-2 text-slate-700 dark:text-slate-300 text-lg">
                                    {validBody2.map((point, index) => <li key={`col2-${index}`}>{point}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                );
            case 'TWO_COLUMN_TEXT':
                return (
                    <div className="flex gap-6">
                        <div className="w-1/2">
                            {validBody1.length > 0 && (
                                <ul className="custom-bullets space-y-2 text-slate-700 dark:text-slate-300 text-lg">
                                    {validBody1.map((point, index) => <li key={`col1-${index}`}>{point}</li>)}
                                </ul>
                            )}
                        </div>
                        <div className="w-1/2">
                             {validBody2.length > 0 && (
                                <ul className="custom-bullets space-y-2 text-slate-700 dark:text-slate-300 text-lg">
                                    {validBody2.map((point, index) => <li key={`col2-${index}`}>{point}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                );
            case 'TITLE_ONLY': // Title is rendered in parent, this component is for body content.
                return null;
            case 'DEFAULT':
            case 'DEFAULT_REVERSE':
            case 'ONE_COLUMN_TEXT':
            case 'TIMELINE':
            default:
                return renderDefaultContent();
        }
    };

    return <div className="ml-10 mt-4 flex-grow">{renderContent()}</div>;
};

export default SlideContent;