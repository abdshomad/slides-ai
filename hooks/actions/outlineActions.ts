import { generateOutline } from '../../services/outlineService';
// FIX: Correct import path for types
import { AppState, FilePart, ManagedFile, PresentationProject, Source } from '../../types/index';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ActionContext {
    currentState: AppState;
    createCheckpoint: (action: string, state: AppState) => void;
}

interface GenerateOutlineArgs extends ActionContext {
    inputText: string;
    managedFiles: ManagedFile[];
    presentation: PresentationProject;
    setError: SetState<string | null>;
    setIsLoading: SetState<boolean>;
    setLoadingMessage: SetState<string>;
    setOutline: SetState<string>;
    setSources: SetState<Source[]>;
    setPresentationTitle: SetState<string>;
    setGenerationStep: SetState<AppState['generationStep']>;
    onUpdatePresentation: (id: string, updates: Partial<PresentationProject>) => void;
}
export const generateOutlineAction = async (args: GenerateOutlineArgs) => {
    const {
        inputText, managedFiles, presentation,
        setError, setIsLoading, setLoadingMessage, setOutline, setSources, setPresentationTitle, setGenerationStep,
        onUpdatePresentation, createCheckpoint, currentState
    } = args;

    setError(null);
    setIsLoading(true);
    setLoadingMessage('Researching & building outline...');
    try {
        const completedFiles = managedFiles.filter(f => f.status === 'completed' && f.data && f.mimeType);
        const fileParts: FilePart[] = completedFiles.map(f => ({
            inlineData: { data: f.data!, mimeType: f.mimeType! }
        }));

        const result = await generateOutline(inputText, fileParts);
        setOutline(result.outline);
        setSources(result.sources);
        if (presentation.title.startsWith('Untitled')) {
            setPresentationTitle(result.title);
            onUpdatePresentation(presentation.id, { title: result.title });
        }
        const nextStep: AppState['generationStep'] = 'outline';
        setGenerationStep(nextStep);
        createCheckpoint('Generated Outline', {
            ...currentState,
            outline: result.outline,
            sources: result.sources,
            generationStep: nextStep,
            inputText,
        });

    } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
};