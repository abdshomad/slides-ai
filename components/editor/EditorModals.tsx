import React from 'react';
// FIX: Correct import path for types
import { Slide, HistoryCheckpoint, FactCheckResult, BrandKit } from '../../types/index';
import EditSlideModal from '../EditSlideModal';
import StyleSelectorModal from '../StyleSelectorModal';
import SlideHistoryPanel from '../SlideHistoryPanel';
import FactCheckModal from '../FactCheckModal';
import CritiqueModal from '../CritiqueModal';
import AdaptAudienceModal from '../AdaptAudienceModal';
import ImageStudioModal from '../ImageStudioModal';

interface EditorModalsProps {
    presentationHistory: HistoryCheckpoint[];
    editingSlide: Slide | null;
    stylingSlide: Slide | null;
    adaptingAudienceSlide: Slide | null;
    imageStudioSlide: Slide | null;
    historySlideId: string | null;
    factCheckResult: { slideId: string; suggestions: FactCheckResult } | null;
    critiqueResult: { slideId: string; critique: string } | null;
    isImageStudioOpen: boolean;
    brandKit: BrandKit;
    onCloseEditing: () => void;
    onCloseStyling: () => void;
    onCloseAdaptingAudience: () => void;
    onCloseHistory: () => void;
    onCloseImageStudio: () => void;
    onEditSlide: (prompt: string) => void;
    onStyleSlide: (layout: string) => void;
    onAdaptAudience: (targetAudience: string) => void;
    onRestoreSlide: (slideState: Slide) => void;
    onCloseFactCheck: () => void;
    onApplyFactCheck: () => void;
    onCloseCritique: () => void;
    onGenerateImage: (slideId: string, prompt: string, negativePrompt?: string) => void;
    onEditImage: (slideId: string, prompt: string) => void;
    onGenerateImageSuggestions: (slideId: string) => void;
    onSelectImageSuggestion: (slideId: string, suggestion: string) => void;
    onSelectImageFromSearch: (slideId: string, url: string) => void;
    onApplyStyleToAll: (style: string, useBrandColors: boolean) => void;
}

const EditorModals: React.FC<EditorModalsProps> = (props) => {
    const {
        presentationHistory,
        editingSlide,
        stylingSlide,
        adaptingAudienceSlide,
        imageStudioSlide,
        historySlideId,
        factCheckResult,
        critiqueResult,
        isImageStudioOpen,
        brandKit,
        onCloseEditing,
        onCloseStyling,
        onCloseAdaptingAudience,
        onCloseHistory,
        onCloseImageStudio,
        onEditSlide,
        onStyleSlide,
        onAdaptAudience,
        onRestoreSlide,
        onCloseFactCheck,
        onApplyFactCheck,
        onCloseCritique,
        onGenerateImage,
        onEditImage,
        onGenerateImageSuggestions,
        onSelectImageSuggestion,
        onSelectImageFromSearch,
        onApplyStyleToAll,
    } = props;

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

            {isImageStudioOpen && imageStudioSlide && (
                <ImageStudioModal
                    slide={imageStudioSlide}
                    brandKit={brandKit}
                    onClose={onCloseImageStudio}
                    onGenerateImage={onGenerateImage}
                    onEditImage={onEditImage}
                    onGenerateSuggestions={onGenerateImageSuggestions}
                    onSelectSuggestion={onSelectImageSuggestion}
                    onSelectFromSearch={onSelectImageFromSearch}
                    onApplyStyleToAll={onApplyStyleToAll}
                />
            )}
        </>
    );
};

export default EditorModals;