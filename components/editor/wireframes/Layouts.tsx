import React from 'react';
import { WireframeBox, TitleBar, TextLine, ImageBox } from './common';

export const OneColumnTextWireframe: React.FC = () => (
    <WireframeBox>
        <TitleBar />
        <TextLine />
        <TextLine />
        <TextLine width="5/6" />
    </WireframeBox>
);

export const DefaultWireframe: React.FC = () => (
    <WireframeBox>
        <TitleBar />
        <div className="flex gap-2 flex-grow">
            <div className="w-1/2 flex flex-col gap-1.5">
                <TextLine />
                <TextLine />
            </div>
            <div className="w-1/2">
                <ImageBox />
            </div>
        </div>
    </WireframeBox>
);

export const DefaultReverseWireframe: React.FC = () => (
    <WireframeBox>
        <TitleBar />
        <div className="flex gap-2 flex-grow">
            <div className="w-1/2">
                <ImageBox />
            </div>
            <div className="w-1/2 flex flex-col gap-1.5">
                <TextLine />
                <TextLine />
            </div>
        </div>
    </WireframeBox>
);

export const MainPointEmphasisWireframe: React.FC = () => (
    <WireframeBox>
        <TitleBar />
        <div className="flex-grow flex items-center justify-center">
            <div className="h-4 bg-pink-500/80 rounded-sm w-1/2"></div>
        </div>
        <TextLine width="5/6" />
    </WireframeBox>
);

export const TitleOnlyWireframe: React.FC = () => (
    <WireframeBox className="items-center justify-center">
        <div className="h-3 bg-pink-500/80 rounded-sm w-3/4"></div>
    </WireframeBox>
);

export const SectionHeaderWireframe: React.FC = () => (
    <WireframeBox className="items-center justify-center">
        <div className="flex flex-col gap-2 w-full items-center">
            <div className="h-3 bg-pink-500/80 rounded-sm w-3/4"></div>
            <div className="h-2 bg-slate-600 rounded-sm w-1/2"></div>
        </div>
    </WireframeBox>
);

export const QuoteWireframe: React.FC = () => (
    <WireframeBox className="items-center justify-center p-3">
        <div className="h-1 bg-slate-600 rounded-sm w-1/4 self-start opacity-50"></div>
        <div className="flex-grow flex flex-col items-center justify-center w-full gap-1.5">
            <TextLine width="5/6" />
            <TextLine width="3/4" />
        </div>
        <div className="h-1 bg-slate-600 rounded-sm w-1/4 self-end opacity-50"></div>
    </WireframeBox>
);

export const TwoColumnTextWireframe: React.FC = () => (
    <WireframeBox>
        <TitleBar />
        <div className="flex gap-2 flex-grow">
            <div className="w-1/2 flex flex-col gap-1.5">
                <TextLine />
                <TextLine />
                <TextLine />
            </div>
            <div className="w-1/2 flex flex-col gap-1.5">
                <TextLine />
                <TextLine />
                <TextLine />
            </div>
        </div>
    </WireframeBox>
);

export const TimelineWireframe: React.FC = () => (
    <WireframeBox>
        <TitleBar />
        <div className="flex gap-2 flex-grow items-center">
            <div className="w-0.5 h-full bg-slate-600 rounded-full ml-1"></div>
            <div className="flex-grow flex flex-col justify-around h-full">
                <TextLine width="5/6" />
                <TextLine width="5/6" />
                <TextLine width="5/6" />
            </div>
        </div>
    </WireframeBox>
);

export const ComparisonWireframe: React.FC = () => (
    <WireframeBox>
        <TitleBar />
        <div className="flex gap-2 flex-grow">
            <div className="w-1/2 flex flex-col gap-1">
                <div className="h-1.5 bg-pink-500/60 rounded-sm w-2/3"></div>
                <TextLine />
                <TextLine />
            </div>
            <div className="w-1/2 flex flex-col gap-1">
                <div className="h-1.5 bg-pink-500/60 rounded-sm w-2/3"></div>
                <TextLine />
                <TextLine />
            </div>
        </div>
    </WireframeBox>
);
