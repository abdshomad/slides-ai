import { generateSlidesStream } from '../../services/slideService';
import { slideGenerationSteps } from '../../utils/loadingSteps';
// FIX: Correct import path for types
import { AppState, FilePart, ManagedFile, Slide as SlideType, Source, GenerationStats } from '../../types/index';
import { ActionContext } from './outlineActions';
import { ProgressSimulator } from '../../utils/progressSimulator';

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
    setGenerationStep: SetState<AppState['generationStep']>;
    setCurrentLoadingStep: SetState<number>;
    setCurrentLoadingSubStep: SetState<number>;
    setGenerationStats: SetState<GenerationStats>;
}
export const generateSlidesAction = async (args: GenerateSlidesArgs) => {
    const {
        managedFiles, inputText, outline, tone, sources,
        setError, setIsLoading, setLoadingMessage, setSlides, setGenerationStep,
        setCurrentLoadingStep, setCurrentLoadingSubStep, setGenerationStats,
        createCheckpoint, currentState
    } = args;

    setError(null);
    setIsLoading(true);
    setLoadingMessage('');
    setCurrentLoadingStep(0);
    setCurrentLoadingSubStep(0);
    setSlides([]);
    const nextStep: AppState['generationStep'] = 'slides';
    setGenerationStep(nextStep);

    setGenerationStats({
        sourcesAnalyzed: sources.length,
        imagesSourced: 0,
        imagesToGenerate: 0,
        slidesCreated: 0,
    });

    const simulator = new ProgressSimulator(
        slideGenerationSteps,
        (stepIndex, subStepIndex) => {
            setCurrentLoadingStep(stepIndex);
            setCurrentLoadingSubStep(subStepIndex);
        },
        1200
    );

    try {
        simulator.start();

        const completedFiles = managedFiles.filter(f => f.status === 'completed' && f.data && f.mimeType);
        const fileParts: FilePart[] = completedFiles.map(f => ({ inlineData: { data: f.data!, mimeType: f.mimeType! } }));
        
        const tempSlides: SlideType[] = [];
        const slideStream = generateSlidesStream(inputText, fileParts, outline, tone);
        
        for await (const slideData of slideStream) {
            const newSlide: SlideType = {
                id: `slide_${Date.now()}_${Math.random()}`,
                ...slideData,
                title: slideData.title || "Untitled Slide",
                bulletPoints: Array.isArray(slideData.bulletPoints) ? slideData.bulletPoints : [],
                isLoadingImage: false, // Image is not loading initially
                layout: 'DEFAULT'
            };
            tempSlides.push(newSlide);
            setSlides([...tempSlides]);
            setGenerationStats({
                sourcesAnalyzed: sources.length,
                slidesCreated: tempSlides.length,
                imagesSourced: tempSlides.filter(s => s.imageSearchResults && s.imageSearchResults.length > 0).length,
                imagesToGenerate: tempSlides.filter(s => s.imagePrompt).length,
            });
        }
        
        const newState = { ...currentState, slides: tempSlides, generationStep: nextStep, outline, tone, selectedTemplateId: currentState.selectedTemplateId };
        createCheckpoint('Generated Slides', newState);

    } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        simulator.stop();
        setIsLoading(false);
        setCurrentLoadingStep(slideGenerationSteps.length);
        setLoadingMessage('');
    }
};