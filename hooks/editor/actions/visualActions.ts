import { generateImageForSlide, generateImageSuggestions } from '../../services/imageService';
import { editImage } from '../../services/imageEditingService';
import { generateVideoForSlide } from '../../services/videoService';
// FIX: Correct import path for types
import { AppState, Slide as SlideType } from '../../types/index';
// FIX: Corrected import path for ActionContext, which lives in a different directory.
import { ActionContext } from '../../actions/types';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface GenerateImageArgs extends ActionContext {
    slideId: string;
    prompt: string;
    negativePrompt?: string;
    slides: SlideType[];
    setSlides: SetState<SlideType[]>;
}
export const generateImageAction = async ({ slideId, prompt, negativePrompt, slides, setSlides, createCheckpoint, currentState }: GenerateImageArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;

    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isLoadingImage: true } : s));
    const newImage = await generateImageForSlide(prompt, negativePrompt);
    const updatedSlides = slides.map(s => s.id === slideId ? { ...s, image: newImage, imagePrompt: prompt, negativeImagePrompt: negativePrompt, isLoadingImage: false } : s);
    setSlides(updatedSlides);
    createCheckpoint(`Generated image for "${slide.title}"`, { ...currentState, slides: updatedSlides });
};

interface GenerateVideoArgs extends ActionContext {
    slideId: string;
    prompt: string;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
}
export const generateVideoAction = async ({ slideId, prompt, slides, setError, setSlides, createCheckpoint, currentState }: GenerateVideoArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;

    const updateProgress = (message: string) => {
        setSlides(prev => prev.map(s => s.id === slideId ? { ...s, videoGenerationProgress: message } : s));
    };

    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isGeneratingVideo: true, videoPrompt: prompt } : s));
    setError(null);
    try {
        const videoDataUrl = await generateVideoForSlide(prompt, updateProgress);
        const updatedSlides = slides.map(s => s.id === slideId ? { 
            ...s, 
            video: videoDataUrl, 
            isGeneratingVideo: false,
            // Clear image fields if a video is successfully generated
            image: undefined,
            imagePrompt: undefined,
            imageSearchResults: undefined,
            selectedImageUrl: undefined,
        } : s);
        setSlides(updatedSlides);
        createCheckpoint(`Generated video for "${slide.title}"`, { ...currentState, slides: updatedSlides });

    } catch(e) {
        setError(e instanceof Error ? e.message : 'Failed to generate video.');
        setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isGeneratingVideo: false } : s));
    }
};

interface EditImageArgs extends ActionContext {
    slideId: string;
    prompt: string;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
}
export const editImageAction = async ({ slideId, prompt, slides, setError, setSlides, createCheckpoint, currentState }: EditImageArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide || !slide.image) return;

    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isLoadingImage: true } : s));
    setError(null);
    try {
        const editedImage = await editImage(slide.image, prompt);
        if (editedImage) {
            const updatedSlides = slides.map(s => s.id === slideId ? { ...s, image: editedImage, isLoadingImage: false } : s);
            setSlides(updatedSlides);
            createCheckpoint(`Edited image for "${slide.title}"`, { ...currentState, slides: updatedSlides });
        } else {
            setError('The AI could not edit this image. Please try a different prompt.');
            setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isLoadingImage: false } : s));
        }
    } catch(e) {
        setError(e instanceof Error ? e.message : 'Failed to edit image.');
        setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isLoadingImage: false } : s));
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
    
    const updatedSlides = slides.map(s => s.id === slideId ? { ...s, image: undefined, imageSuggestions: [], imageSearchResults: [] } : s);
    setSlides(updatedSlides);
    
    createCheckpoint(`Cleared image selection for "${slide.title}"`, { ...currentState, slides: updatedSlides });
};
