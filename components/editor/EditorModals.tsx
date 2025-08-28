import React from 'react';
// FIX: Correct import path for types
import { Slide, HistoryCheckpoint, FactCheckResult } from '../../types/index';
import EditSlideModal from '../EditSlideModal';
import StyleSelectorModal from '../StyleSelectorModal';
import SlideHistoryPanel from '../SlideHistoryPanel';
import FactCheckModal from '../FactCheckModal';
import CritiqueModal from '../CritiqueModal';
import AdaptAudienceModal from '../AdaptAudienceModal';

interface EditorModalsProps {
    presentationHistory: HistoryCheckpoint[];
    editingSlide: Slide | null;
    stylingSlide: Slide | null;
    adaptingAudienceSlide: Slide | null;
    historySlideId: string | null;
    factCheckResult: { slideId: string; suggestions: FactCheckResult } | null;
    critiqueResult: { slideId: string; critique: string } | null;
    onCloseEditing: () => void;
    onCloseStyling: () => void;
    onCloseAdaptingAudience: () => void;
    onCloseHistory: () => void;
    onEditSlide: (prompt: string) => void;
    onStyleSlide: (layout: string) => void;
    onAdaptAudience: (targetAudience: string) => void;
    onRestoreSlide: (slideState: Slide) => void;
    onCloseFactCheck: () => void;
    onApplyFactCheck: () => void;
    onCloseCritique: () => void;
}

const EditorModals: React.FC<EditorModalsProps> = ({
    presentationHistory,
    editingSlide,
    stylingSlide,
    adaptingAudienceSlide,
    historySlideId,
    factCheckResult,
    critiqueResult,
    onCloseEditing,
    onCloseStyling,
    onCloseAdaptingAudience,
    onCloseHistory,
    onEditSlide,
    onStyleSlide,
    onAdaptAudience,
    onRestoreSlide,
    onCloseFactCheck,
    onApplyFactCheck,
    onCloseCritique,
}) => {
    const originalFactCheckSlide = React.useMemo(() => {
        if (!factCheckResult) return null;
        const lastCheckpoint = presentationHistory[presentationHistory.length - 1];
        return lastCheckpoint.state.slides.find(s => s.id === factCheckResult.slideId) || null;
    }, [factCheckResult, presentationHistory]);


    return (
        <>
            {editingSlide && (
                <EditSlideModal
                slide={editingSlide}
                onClose={onCloseEditing}
                onSave={onEditSlide}
                />
            )}
            
            {stylingSlide && (
                <StyleSelectorModal
                slide={stylingSlide}
                onClose={onCloseStyling}
                onSave={onStyleSlide}
                />
            )}

            {historySlideId && (
                <SlideHistoryPanel
                    history={presentationHistory}
                    slideId={historySlideId}
                    onClose={onCloseHistory}
                    onRestore={onRestoreSlide}
                />
            )}
            
            {adaptingAudienceSlide && (
                <AdaptAudienceModal
                    slide={adaptingAudienceSlide}
                    onClose={onCloseAdaptingAudience}
                    onSave={onAdaptAudience}
                />
            )}

            {factCheckResult && originalFactCheckSlide && (
                <FactCheckModal
                    originalSlide={originalFactCheckSlide}
                    suggestions={factCheckResult.suggestions}
                    onClose={onCloseFactCheck}
                    onApply={onApplyFactCheck}
                />
            )}

            {critiqueResult && (
                <CritiqueModal
                    critique={critiqueResult.critique}
                    onClose={onCloseCritique}
                />
            )}
        </>
    );
};

export default EditorModals;