import { generateImageForSlide, generateImageSuggestions } from '../../services/imageService';
// FIX: Correct import path for types
import { Slide as SlideType } from '../../types/index';
import { ActionContext } from './types';

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
