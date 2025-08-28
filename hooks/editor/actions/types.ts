import { PresentationProject, AppState, ManagedFile, PresentationTemplate, BrandKit } from '../../../types/index';

// Define a type for the large props object for clarity
export interface ActionHookProps {
    presentation: PresentationProject;
    onUpdatePresentation: (id: string, updates: Partial<PresentationProject>) => void;
    onAddCheckpoint: (id: string, action: string, state: AppState) => void;
    state: any; // A simplified type for the state object from useEditorState
    setters: any; // A simplified type for the setters object from useEditorState
    modalState: any; // from useEditorModals
    modalSetters: any; // from useEditorModals
    managedFiles: ManagedFile[];
    timer: { startTimer: () => void; stopTimer: () => void; elapsedTime: number };
    currentState: AppState;
    selectedTemplate: PresentationTemplate;
    brandKit: BrandKit;
}
