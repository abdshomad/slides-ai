import { expandSlide, factCheckSlide, adaptAudience } from '../../services/slideEditingService';
import { generateSpeakerNotes, generateKeyTakeaway } from '../../services/slideContentService';
// FIX: Correct import path for types
import { AppState, Slide as SlideType, FactCheckResult } from '../../types/index';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface GenerateNotesArgs {
    slideId: string;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
    currentState: AppState;
    createCheckpoint: (action: string, state: AppState) => void;
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

interface GenerateTakeawayArgs {
    slideId: string;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
    currentState: AppState;
    createCheckpoint: (action: string, state: AppState) => void;
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

interface ExpandSlideArgs {
    slideId: string;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
    currentState: AppState;
    createCheckpoint: (action: string, state: AppState) => void;
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

interface AdaptAudienceArgs {
    targetAudience: string;
    adaptingAudienceSlideId: string | null;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
    setAdaptingAudienceSlideId: SetState<string | null>;
    currentState: AppState;
    createCheckpoint: (action: string, state: AppState) => void;
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
