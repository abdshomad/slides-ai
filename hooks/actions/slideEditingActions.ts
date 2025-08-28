import { editSlide, expandSlide, factCheckSlide, adaptAudience } from '../../services/slideEditingService';
import { generateSpeakerNotes, generateKeyTakeaway } from '../../services/slideContentService';
import { generateImageForSlide, generateImageSuggestions } from '../../services/imageService';
// FIX: Correct import path for types
import { AppState, Slide as SlideType, FactCheckResult } from '../../types/index';
import { ActionContext } from './outlineActions';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;


interface GenerateImageArgs extends ActionContext {
    slideId: string;
    slides: SlideType[];
    setSlides: SetState<SlideType[]>;
}
export const generateImageAction = async ({ slideId, slides, setSlides, createCheckpoint, currentState }: GenerateImageArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide || !slide.imagePrompt) return;

    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isLoadingImage: true } : s));
    const newImage = await generateImageForSlide(slide.imagePrompt);
    const updatedSlides = slides.map(s => s.id === slideId ? { ...s, image: newImage, isLoadingImage: false } : s);
    setSlides(updatedSlides);
    createCheckpoint(`Generated image for "${slide.title}"`, { ...currentState, slides: updatedSlides });
};

interface EditSlideArgs extends ActionContext {
    prompt: string;
    editingSlideId: string | null;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
    setEditingSlideId: SetState<string | null>;
}
export const editSlideAction = async (args: EditSlideArgs) => {
    const { prompt, editingSlideId, slides, setError, setSlides, setEditingSlideId, createCheckpoint, currentState } = args;

    if (!editingSlideId) return;
    const originalSlide = slides.find(s => s.id === editingSlideId);
    if (!originalSlide) return;

    setEditingSlideId(null);

    // Provide immediate feedback that something is happening
    const slidesWithLoader = slides.map(s => 
        s.id === editingSlideId ? { ...s, isFactChecking: true } : s // Using another loader state for visual feedback
    );
    setSlides(slidesWithLoader);

    try {
        const modelResponse = await editSlide(originalSlide, prompt);
        
        const newBulletPoints = Array.isArray(modelResponse.bulletPoints)
            ? modelResponse.bulletPoints
            : originalSlide.bulletPoints;

        let updatedSlide: SlideType = { ...originalSlide, ...modelResponse, bulletPoints: newBulletPoints, isFactChecking: false };

        // Case 1: New image search results were returned. Clear old image state.
        if (modelResponse.imageSearchResults && modelResponse.imageSearchResults.length > 0) {
            updatedSlide = { 
                ...updatedSlide, 
                image: undefined, 
                imagePrompt: undefined,
                selectedImageUrl: undefined,
            };
        } 
        // Case 2: A new image prompt was generated. Clear old image state.
        else if (modelResponse.imagePrompt && modelResponse.imagePrompt !== originalSlide.imagePrompt) {
            updatedSlide = { 
                ...updatedSlide, 
                image: undefined,
                imageSearchResults: undefined,
                selectedImageUrl: undefined,
            };
        }
        // Case 3: No visual changes were requested or found. Keep the original image.
        else {
            updatedSlide = { ...updatedSlide, image: originalSlide.image, imagePrompt: originalSlide.imagePrompt, imageSearchResults: originalSlide.imageSearchResults, selectedImageUrl: originalSlide.selectedImageUrl };
        }
        
        const finalSlides = slides.map(s => (s.id === editingSlideId ? updatedSlide : s));
        setSlides(finalSlides);
        createCheckpoint(`Edited slide: "${originalSlide.title}"`, { ...currentState, slides: finalSlides });

    } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to edit slide.');
        // Revert to original slide state on error
        setSlides(slides.map(s => (s.id === editingSlideId ? originalSlide : s)));
    }
};

interface GenerateNotesArgs extends ActionContext {
    slideId: string;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
}
export const generateNotesAction = async ({ slideId, slides, setError, setSlides, createCheckpoint, currentState }: GenerateNotesArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;
    
    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isGeneratingNotes: true } : s));
    try {
        const notes = await generateSpeakerNotes({ title: slide.title, bulletPoints: slide.bulletPoints });
        setSlides(prevSlides => {
            const updatedSlides = prevSlides.map(s => s.id === slideId ? { ...s, speakerNotes: notes, isGeneratingNotes: false } : s);
            createCheckpoint(`Generated speaker notes for "${slide.title}"`, { ...currentState, slides: updatedSlides });
            return updatedSlides;
        });
    } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to generate speaker notes.');
        setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isGeneratingNotes: false } : s));
    }
};

interface GenerateTakeawayArgs extends ActionContext {
    slideId: string;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
}
export const generateTakeawayAction = async ({ slideId, slides, setError, setSlides, createCheckpoint, currentState }: GenerateTakeawayArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;

    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isGeneratingTakeaway: true } : s));
    try {
        const takeaway = await generateKeyTakeaway({ title: slide.title, bulletPoints: slide.bulletPoints });
        setSlides(prevSlides => {
            const updatedSlides = prevSlides.map(s => s.id === slideId ? { ...s, keyTakeaway: takeaway, isGeneratingTakeaway: false } : s);
            createCheckpoint(`Generated key takeaway for "${slide.title}"`, { ...currentState, slides: updatedSlides });
            return updatedSlides;
        });
    } catch(e) {
        setError(e instanceof Error ? e.message : 'Failed to generate key takeaway.');
        setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isGeneratingTakeaway: false } : s));
    }
};

interface ExpandSlideArgs extends ActionContext {
    slideId: string;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
}
export const expandSlideAction = async (args: ExpandSlideArgs) => {
    const { slideId, slides, setError, setSlides, createCheckpoint, currentState } = args;

    const slideIndex = slides.findIndex(s => s.id === slideId);
    if (slideIndex === -1) return;
    const slide = slides[slideIndex];
    
    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isExpanding: true } : s));
    setError(null);
    try {
        const newSlidesData = await expandSlide({ title: slide.title, bulletPoints: slide.bulletPoints });

        const newSlidesWithIds: SlideType[] = newSlidesData.map(slideData => ({
            id: `slide_${Date.now()}_${Math.random()}`,
            ...slideData,
            title: slideData.title || 'Untitled Slide',
            bulletPoints: Array.isArray(slideData.bulletPoints) ? slideData.bulletPoints : [],
            isLoadingImage: !!(slideData.imageSearchResults || slideData.imagePrompt),
            layout: 'DEFAULT'
        }));
        
        setSlides(prevSlides => {
            const currentSlideIndex = prevSlides.findIndex(s => s.id === slideId);
            if (currentSlideIndex === -1) return prevSlides;

            const updatedSlides = [
                ...prevSlides.slice(0, currentSlideIndex + 1),
                ...newSlidesWithIds,
                ...prevSlides.slice(currentSlideIndex + 1),
            ].map(s => s.id === slideId ? { ...s, isExpanding: false } : s);
            
            const stateForCheckpoint = { ...currentState, slides: updatedSlides };
            createCheckpoint(`Expanded slide "${slide.title}"`, stateForCheckpoint);
            return updatedSlides;
        });
        
    } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to expand slide.');
        setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isExpanding: false } : s));
    }
};

interface FactCheckSlideArgs {
    slideId: string;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
    setFactCheckResult: SetState<{ slideId: string; suggestions: FactCheckResult } | null>;
}
export const factCheckSlideAction = async ({ slideId, slides, setError, setSlides, setFactCheckResult }: FactCheckSlideArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;

    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isFactChecking: true } : s));
    setError(null);
    try {
        const result = await factCheckSlide(slide);
        setFactCheckResult({ slideId, suggestions: result });
    } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to perform fact-check.');
    } finally {
        setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isFactChecking: false } : s));
    }
};

interface AdaptAudienceArgs extends ActionContext {
    targetAudience: string;
    adaptingAudienceSlideId: string | null;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
    setAdaptingAudienceSlideId: SetState<string | null>;
}
export const adaptAudienceAction = async (args: AdaptAudienceArgs) => {
    const { targetAudience, adaptingAudienceSlideId, slides, setError, setSlides, setAdaptingAudienceSlideId, createCheckpoint, currentState } = args;

    if (!adaptingAudienceSlideId) return;
    const originalSlide = slides.find(s => s.id === adaptingAudienceSlideId);
    if (!originalSlide) return;

    setAdaptingAudienceSlideId(null);
    setSlides(prev => prev.map(s => s.id === adaptingAudienceSlideId ? { ...s, isAdaptingAudience: true } : s));
    setError(null);
    
    try {
        const rewrittenContent = await adaptAudience(originalSlide, targetAudience);
        const updatedSlides = slides.map(s => 
            s.id === adaptingAudienceSlideId 
                ? { ...s, ...rewrittenContent, isAdaptingAudience: false } 
                : s
        );
        setSlides(updatedSlides);
        createCheckpoint(`Adapted "${originalSlide.title}" for new audience`, { ...currentState, slides: updatedSlides });
    } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to adapt slide content.');
        setSlides(prev => prev.map(s => s.id === adaptingAudienceSlideId ? { ...s, isAdaptingAudience: false } : s));
    }
};

interface GenerateSuggestionsArgs extends ActionContext {
    slideId: string;
    slides: SlideType[];
    setSlides: SetState<SlideType[]>;
}
export const generateImageSuggestionsAction = async ({ slideId, slides, setSlides, createCheckpoint, currentState }: GenerateSuggestionsArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;

    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isGeneratingSuggestions: true } : s));
    
    const prompt = `A professional, visually appealing image for a presentation slide titled "${slide.title}". The content includes: ${slide.bulletPoints.join(', ')}.`;
    const suggestions = await generateImageSuggestions(prompt);

    const updatedSlides = slides.map(s => s.id === slideId 
        ? { ...s, imageSuggestions: suggestions, isGeneratingSuggestions: false } 
        : s
    );
    setSlides(updatedSlides);
    createCheckpoint(`Generated image suggestions for "${slide.title}"`, { ...currentState, slides: updatedSlides });
};

interface SelectSuggestionArgs extends ActionContext {
    slideId: string;
    suggestion: string;
    slides: SlideType[];
    setSlides: SetState<SlideType[]>;
}
export const selectImageSuggestionAction = async ({ slideId, suggestion, slides, setSlides, createCheckpoint, currentState }: SelectSuggestionArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;
    
    const updatedSlides = slides.map(s => s.id === slideId ? { ...s, image: suggestion } : s);
    setSlides(updatedSlides);
    createCheckpoint(`Selected image for "${slide.title}"`, { ...currentState, slides: updatedSlides });
};

interface ClearSelectionArgs extends ActionContext {
    slideId: string;
    slides: SlideType[];
    setSlides: SetState<SlideType[]>;
}
export const clearSelectedImageAction = async ({ slideId, slides, setSlides, createCheckpoint, currentState }: ClearSelectionArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;
    
    const updatedSlides = slides.map(s => s.id === slideId ? { ...s, image: undefined } : s);
    setSlides(updatedSlides);
    
    createCheckpoint(`Cleared image selection for "${slide.title}"`, { ...currentState, slides: updatedSlides });
};