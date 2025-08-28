import { generateSlidesStream } from '../../services/slideService';
import { slideGenerationSteps } from '../../utils/loadingSteps';
// FIX: Correct import path for types
import { AppState, FilePart, ManagedFile, Slide as SlideType, Source, GenerationStats } from '../../types/index';
// FIX: Correctly import ActionContext from its source file './types'.
import { ActionContext } from './types';
import { ProgressSimulator } from '../../utils/progressSimulator';
import { parseOutline } from '../../utils/outlineParser';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface GenerateSlidesArgs extends ActionContext {
    managedFiles: ManagedFile[];
    inputText: string;
    outline: string;
    tone: string;
    sources: Source[];
    setError: SetState<string | null>;
    setIsLoading: SetState<boolean>;
    setLoadingMessage: SetState<string>;
    setSlides: SetState<SlideType[]>;
    setSourcedImages: SetState<{ url: string; title: string; }[]>;
    setGenerationStep: SetState<AppState['generationStep']>;
    setCurrentLoadingStep: SetState<number>;
    setCurrentLoadingSubStep: SetState<number>;
    setGenerationStats: SetState<GenerationStats>;
    setGeneratingSlideId: SetState<string | null>;
}
export const generateSlidesAction = async (args: GenerateSlidesArgs) => {
    const {
        managedFiles, inputText, outline, tone, sources,
        setError, setIsLoading, setLoadingMessage, setSlides, setSourcedImages, setGenerationStep,
        setCurrentLoadingStep, setCurrentLoadingSubStep, setGenerationStats, setGeneratingSlideId,
        createCheckpoint, currentState
    } = args;

    setError(null);
    setIsLoading(true);
    setLoadingMessage('Generating slides...');
    setSlides([]);

    const parsedOutline = parseOutline(outline);
    const numSlides = parsedOutline.length;

    if (numSlides === 0) {
        setError("The outline is empty. Cannot generate slides.");
        setIsLoading(false);
        return;
    }

    // 1. Create and display placeholders immediately
    const placeholderSlides: SlideType[] = Array.from({ length: numSlides }, (_, i) => ({
      id: `slide_placeholder_${i}_${Date.now()}`,
      title: parsedOutline[i]?.title || 'Untitled Slide',
      bulletPoints: [],
      isLoading: true,
      layout: parsedOutline[i]?.layout || 'DEFAULT',
    }));
    setSlides(placeholderSlides);

    const nextStep: AppState['generationStep'] = 'slides';
    setGenerationStep(nextStep);

    setGenerationStats({
        sourcesAnalyzed: sources.length,
        imagesSourced: 0,
        imagesToGenerate: 0,
        slidesCreated: 0,
    });

    let tempSlides = [...placeholderSlides];

    try {
        const completedFiles = managedFiles.filter(f => f.status === 'completed' && f.data && f.mimeType);
        const fileParts: FilePart[] = completedFiles.map(f => ({ inlineData: { data: f.data!, mimeType: f.mimeType! } }));
        
        const slideStream = generateSlidesStream(inputText, fileParts, outline, tone);
        
        let slideIndex = 0;
        for await (const slideData of slideStream) {
            if (slideIndex >= numSlides) {
                console.warn("AI generated more slides than expected from the outline.");
                continue;
            }

            const placeholderSlide = tempSlides[slideIndex];
            setGeneratingSlideId(placeholderSlide.id);
            tempSlides[slideIndex] = {
                ...placeholderSlide,
                ...slideData,
                title: slideData.title || placeholderSlide.title,
                bulletPoints: Array.isArray(slideData.bulletPoints) ? slideData.bulletPoints : [],
                isLoading: false, // Mark as loaded
            };
            setSlides([...tempSlides]); // Update UI with the newly loaded slide

            setGenerationStats(prev => ({
                ...prev,
                slidesCreated: slideIndex + 1,
                imagesSourced: prev.imagesSourced + (slideData.imageSearchResults ? 1 : 0),
                imagesToGenerate: prev.imagesToGenerate + (slideData.imagePrompt ? 1 : 0),
            }));

            slideIndex++;
        }
        
        // Mark any remaining placeholders as not loading (e.g., if stream ends early)
        tempSlides = tempSlides.map(s => ({ ...s, isLoading: false }));
        setSlides(tempSlides);

        const allImageSearchResults = tempSlides.flatMap(s => s.imageSearchResults || []).filter(img => img && img.url);

        const newState: AppState = {
            ...currentState,
            slides: tempSlides,
            sourcedImages: allImageSearchResults,
            outline,
            tone,
            selectedTemplateId: currentState.selectedTemplateId,
            generationStep: 'slides', // Default value
        };

        if (allImageSearchResults.length > 0) {
            const nextStepForReview: AppState['generationStep'] = 'image-review';
            setGenerationStep(nextStepForReview);
            setSourcedImages(allImageSearchResults);
            newState.generationStep = nextStepForReview;
        } else {
            setGenerationStep('slides');
        }

        createCheckpoint('Generated Slides', newState);

    } catch (e) {
        setSlides(prev => prev.map(slide => ({ ...slide, isLoading: false })));
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
        setGeneratingSlideId(null);
    }
};