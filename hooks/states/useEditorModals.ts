import { useState } from 'react';
import { FactCheckResult } from '../../types/index';

export const useEditorModals = () => {
    const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
    const [stylingSlideId, setStylingSlideId] = useState<string | null>(null);
    const [historySlideId, setHistorySlideId] = useState<string | null>(null);
    const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
    const [factCheckResult, setFactCheckResult] = useState<{ slideId: string; suggestions: FactCheckResult } | null>(null);
    const [critiqueResult, setCritiqueResult] = useState<{ slideId: string; critique: string } | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [adaptingAudienceSlideId, setAdaptingAudienceSlideId] = useState<string | null>(null);

    const modalState = {
        editingSlideId, stylingSlideId, historySlideId, isHistoryPanelOpen, factCheckResult, critiqueResult, isEditingTitle, adaptingAudienceSlideId,
    };

    const setters = {
        setEditingSlideId, setStylingSlideId, setHistorySlideId, setIsHistoryPanelOpen, setFactCheckResult, setCritiqueResult, setIsEditingTitle, setAdaptingAudienceSlideId,
    };

    return { modalState, setters };
};