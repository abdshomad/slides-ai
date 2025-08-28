import { useCallback } from 'react';
import { editSlideAction } from '../../actions/editActions';
import {
    generateImageAction,
    generateImageSuggestionsAction,
    selectImageSuggestionAction,
    clearSelectedImageAction,
    editImageAction,
} from '../../actions/visualActions';
import { critiqueSlide } from '../../../services/slideEditingService';
import { generateImageForSlide } from '../../../services/imageService';
import { fetchImageAsBase64 } from '../../../utils/fileUtils';
import { Slide as SlideType } from '../../../types/index';
import { ActionHookProps } from './types';

export const useSlideVisualActions = ({
    presentation, onAddCheckpoint,
    state, setters, modalState, modalSetters, brandKit
}: ActionHookProps) => {
    const { slides, currentState } = state;
    const { setError, setSlides } = setters;
    const { editingSlideId, stylingSlideId, imageStudioSlideId } = modalState;
    const { setEditingSlideId, setStylingSlideId, setCritiqueResult, setIsImageStudioOpen, setImageStudioSlideId } = modalSetters;

    const createCheckpoint = useCallback((action: string, stateForCheckpoint: any) => {
        onAddCheckpoint(presentation.id, action, stateForCheckpoint);
    }, [onAddCheckpoint, presentation.id]);

    const handleEditSlide = useCallback(
        (prompt: string) => editSlideAction({
            prompt, editingSlideId, slides, setError, setSlides, setEditingSlideId, createCheckpoint, currentState
        }), [editingSlideId, slides, createCheckpoint, currentState, setError, setSlides, setEditingSlideId]
    );

    const handleUpdateSlideLayout = useCallback((layout: string) => {
        if (!stylingSlideId) return;
        const slideTitle = slides.find(s => s.id === stylingSlideId)?.title || 'slide';
        const updatedSlides = slides.map(s => s.id === stylingSlideId ? { ...s, layout } : s);
        setSlides(updatedSlides);
        createCheckpoint(`Changed layout for "${slideTitle}"`, { ...currentState, slides: updatedSlides });
        setStylingSlideId(null);
    }, [slides, stylingSlideId, createCheckpoint, currentState, setSlides, setStylingSlideId]);

    const handleCritiqueSlide = useCallback(async (slideId: string, imageBase64: string) => {
        const slide = slides.find((s: SlideType) => s.id === slideId);
        if (!slide) return;

        setSlides((prev: SlideType[]) => prev.map(s => s.id === slideId ? { ...s, isCritiquing: true } : s));
        setError(null);
        try {
            const critique = await critiqueSlide(imageBase64);
            setCritiqueResult({ slideId, critique });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to get design suggestions.');
        } finally {
            setSlides((prev: SlideType[]) => prev.map(s => s.id === slideId ? { ...s, isCritiquing: false } : s));
        }
    }, [slides, setError, setSlides, setCritiqueResult]);

    const handleCloseCritique = useCallback(() => {
        setCritiqueResult(null);
    }, [setCritiqueResult]);

    const handleGenerateImageForSlide = useCallback(
        (slideId: string, prompt: string, negativePrompt?: string) => generateImageAction({
            slideId, prompt, negativePrompt, slides, setSlides, createCheckpoint, currentState
        }), [slides, createCheckpoint, currentState, setSlides]
    );

    const handleEditImage = useCallback(
        (slideId: string, prompt: string) => editImageAction({
            slideId, prompt, slides, setError, setSlides, createCheckpoint, currentState
        }), [slides, createCheckpoint, currentState, setSlides, setError]
    );

    const handleSelectImageFromSearch = useCallback(async (slideId: string, imageUrl: string) => {
        const slide = slides.find(s => s.id === slideId);
        if (!slide) return;

        setSlides((prev: SlideType[]) => prev.map(s => s.id === slideId ? { ...s, isLoadingImage: true } : s));
        try {
            const base64Image = await fetchImageAsBase64(imageUrl);
            setSlides((prevSlides: SlideType[]) => {
                const updatedSlides = prevSlides.map(s => s.id === slideId ? { ...s, image: base64Image, selectedImageUrl: imageUrl, isLoadingImage: false } : s);
                createCheckpoint(`Selected image for "${slide.title}"`, { ...currentState, slides: updatedSlides });
                return updatedSlides;
            });
        } catch (e) {
            setError("Failed to fetch the selected image.");
            setSlides((prev: SlideType[]) => prev.map(s => s.id === slideId ? { ...s, isLoadingImage: false } : s));
        }
    }, [slides, createCheckpoint, currentState, setError, setSlides]);

    const handleGenerateImageSuggestions = useCallback(
        (slideId: string) => generateImageSuggestionsAction({
            slideId, slides, setSlides, createCheckpoint, currentState
        }), [slides, setSlides, createCheckpoint, currentState]
    );

    const handleSelectImageSuggestion = useCallback(
        (slideId: string, suggestion: string) => selectImageSuggestionAction({
            slideId, suggestion, slides, setSlides, createCheckpoint, currentState
        }), [slides, setSlides, createCheckpoint, currentState]
    );
    
    const handleClearSelectedImage = useCallback(
        (slideId: string) => clearSelectedImageAction({
            slideId, slides, setSlides, createCheckpoint, currentState
        }), [slides, setSlides, createCheckpoint, currentState]
    );

    const handleOpenImageStudio = (slideId: string) => {
        setImageStudioSlideId(slideId);
        setIsImageStudioOpen(true);
    };

    const handleCloseImageStudio = () => {
        setIsImageStudioOpen(false);
        setImageStudioSlideId(null);
    };

    const handleApplyStyleToAll = useCallback(async (style: string, useBrandColors: boolean) => {
        let suffix = style === 'Default' ? '' : `, in the style of ${style.toLowerCase()}`;
        if (useBrandColors) {
            suffix += `, using a color palette inspired by ${brandKit.primaryColor} and ${brandKit.secondaryColor}`;
        }
        if (!suffix) return;

        const slidesToUpdate = slides.filter(s => s.id !== imageStudioSlideId && s.imagePrompt);
        const slideIdsToUpdate = slidesToUpdate.map(s => s.id);

        setSlides(prev => prev.map(s => slideIdsToUpdate.includes(s.id) ? { ...s, isLoadingImage: true } : s));

        const updateSlideImage = async (slide: SlideType) => {
            const originalPrompt = (slide.imagePrompt || '').split(', in the style of')[0];
            const fullPrompt = `${originalPrompt}${suffix}`;
            const newImage = await generateImageForSlide(fullPrompt, slide.negativeImagePrompt);
            return { slideId: slide.id, newImage, fullPrompt };
        };
        
        const promises = slidesToUpdate.map(updateSlideImage);
        const results = await Promise.all(promises);

        setSlides(prevSlides => {
            const updatedSlides = [...prevSlides];
            results.forEach(result => {
                const index = updatedSlides.findIndex(s => s.id === result.slideId);
                if (index !== -1) {
                    updatedSlides[index] = {
                        ...updatedSlides[index],
                        image: result.newImage || updatedSlides[index].image, // Keep old image on failure
                        imagePrompt: result.fullPrompt,
                        isLoadingImage: false
                    };
                }
            });
            createCheckpoint('Applied visual style to all slides', { ...currentState, slides: updatedSlides });
            return updatedSlides;
        });

    }, [slides, imageStudioSlideId, brandKit, setSlides, createCheckpoint, currentState]);

    return {
        handleEditSlide,
        handleUpdateSlideLayout,
        handleCritiqueSlide,
        handleCloseCritique,
        handleGenerateImageForSlide,
        handleEditImage,
        handleSelectImageFromSearch,
        handleGenerateImageSuggestions,
        handleSelectImageSuggestion,
        handleClearSelectedImage,
        handleOpenImageStudio,
        handleCloseImageStudio,
        handleApplyStyleToAll,
    };
};