import { generateImageForSlide, generateImageSuggestions } from '../../services/imageService';
import { editImage } from '../../services/imageEditingService';
import { generateVideoForSlide } from '../../services/videoService';
// FIX: Correct import path for types
import { AppState, Slide as SlideType } from '../../types/index';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface GenerateImageArgs {
    slideId: string;
    prompt: string;
    negativePrompt?: string;
    slides: SlideType[];
    setSlides: SetState<SlideType[]>;
    currentState: AppState;
    createCheckpoint: (action: string, state: AppState) => void;
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

interface GenerateVideoArgs {
    slideId: string;
    prompt: string;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
    currentState: AppState;
    createCheckpoint: (action: string, state: AppState) => void;
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
        setSlides(prevSlides => {
            const updatedSlides = prevSlides.map(s => s.id === slideId ? { 
                ...s, 
                video: videoDataUrl, 
                isGeneratingVideo: false,
                // Clear image fields if a video is successfully generated
                image: undefined,
                imagePrompt: undefined,
                imageSearchResults: undefined,
                selectedImageUrl: undefined,
            } : s);
            createCheckpoint(`Generated video for "${slide.title}"`, { ...currentState, slides: updatedSlides });
            return updatedSlides;
        });
    } catch(e) {
        setError(e instanceof Error ? e.message : 'Failed to generate video.');
        setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isGeneratingVideo: false } : s));
    }
};

interface EditImageArgs {
    slideId: string;
    prompt: string;
    slides: SlideType[];
    setError: SetState<string | null>;
    setSlides: SetState<SlideType[]>;
    currentState: AppState;
    createCheckpoint: (action: string, state: AppState) => void;
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

interface GenerateSuggestionsArgs {
    slideId: string;
    slides: SlideType[];
    setSlides: SetState<SlideType[]>;
    currentState: AppState;
    createCheckpoint: (action: string, state: AppState) => void;
}
export const generateImageSuggestionsAction = async ({ slideId, slides, setSlides, createCheckpoint, currentState }: GenerateSuggestionsArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;

    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isGeneratingSuggestions: true } : s));
    
    const prompt = `A professional, visually appealing image for a presentation slide titled "${slide.title}". The content includes: ${slide.bulletPoints.join(', ')}.`;
    const suggestions = await generateImageSuggestions(prompt);

    setSlides(prevSlides => {
        const updatedSlides = prevSlides.map(s => s.id === slideId 
            ? { ...s, imageSuggestions: suggestions, isGeneratingSuggestions: false } 
            : s
        );
        createCheckpoint(`Generated image suggestions for "${slide.title}"`, { ...currentState, slides: updatedSlides });
        return updatedSlides;
    });
};

interface SelectSuggestionArgs {
    slideId: string;
    suggestion: string;
    slides: SlideType[];
    setSlides: SetState<SlideType[]>;
    currentState: AppState;
    createCheckpoint: (action: string, state: AppState) => void;
}
export const selectImageSuggestionAction = async ({ slideId, suggestion, slides, setSlides, createCheckpoint, currentState }: SelectSuggestionArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;
    
    const updatedSlides = slides.map(s => s.id === slideId ? { ...s, image: suggestion } : s);
    setSlides(updatedSlides);
    createCheckpoint(`Selected image for "${slide.title}"`, { ...currentState, slides: updatedSlides });
};

interface ClearSelectionArgs {
    slideId: string;
    slides: SlideType[];
    setSlides: SetState<SlideType[]>;
    currentState: AppState;
    createCheckpoint: (action: string, state: AppState) => void;
}
export const clearSelectedImageAction = async ({ slideId, slides, setSlides, createCheckpoint, currentState }: ClearSelectionArgs) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;
    
    const updatedSlides = slides.map(s => s.id === slideId ? { ...s, image: undefined, imageSuggestions: [], imageSearchResults: [] } : s);
    setSlides(updatedSlides);
    
    createCheckpoint(`Cleared image selection for "${slide.title}"`, { ...currentState, slides: updatedSlides });
};