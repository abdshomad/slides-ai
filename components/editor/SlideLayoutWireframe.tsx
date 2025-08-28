import React from 'react';
import * as Layouts from './wireframes/Layouts';

interface SlideLayoutWireframeProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  layout: string;
}

const layoutMap: { [key: string]: React.FC } = {
    ONE_COLUMN_TEXT: Layouts.OneColumnTextWireframe,
    DEFAULT: Layouts.DefaultWireframe,
    DEFAULT_REVERSE: Layouts.DefaultReverseWireframe,
    MAIN_POINT_EMPHASIS: Layouts.MainPointEmphasisWireframe,
    TITLE_ONLY: Layouts.TitleOnlyWireframe,
    SECTION_HEADER: Layouts.SectionHeaderWireframe,
    QUOTE: Layouts.QuoteWireframe,
    TWO_COLUMN_TEXT: Layouts.TwoColumnTextWireframe,
    TIMELINE: Layouts.TimelineWireframe,
    COMPARISON: Layouts.ComparisonWireframe,
};


const SlideLayoutWireframe: React.FC<SlideLayoutWireframeProps> = ({ layout, children, ...props }) => {
    const LayoutComponent = layoutMap[layout] || Layouts.OneColumnTextWireframe; // Fallback to a default

    return (
        <div 
            {...props}
            className={`cursor-pointer ${props.className || ''}`}
            aria-label={props['aria-label'] || `Layout wireframe for ${layout.replace(/_/g, ' ')}`}
        >
            <LayoutComponent />
            {children}
        </div>
    );
};

export default SlideLayoutWireframe;
