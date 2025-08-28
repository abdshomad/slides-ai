import { editSlide } from '../../services/slideEditingService';
// FIX: Correct import path for types
import { Slide as SlideType } from '../../types/index';
import { ActionContext } from './types';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

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
        
        // If a chart is generated, it becomes the primary content.
        if (modelResponse.chartData) {
            updatedSlide = {
                ...updatedSlide,
                bulletPoints: [],
                body1: [],
                body2: [],
                image: undefined,
                imagePrompt: undefined,
                imageSearchResults: undefined,
                selectedImageUrl: undefined,
            };
        }
        // Case 1: New image search results were returned. Clear old image state.
        else if (modelResponse.imageSearchResults && modelResponse.imageSearchResults.length > 0) {
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