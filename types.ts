export interface Slide {
  id: string;
  title: string;
  bulletPoints: string[];
  imagePrompt?: string;
  imageUrl?: string;
  image?: string; // base64 string
  isLoadingImage?: boolean;
  layout?: string;
  speakerNotes?: string;
  isGeneratingNotes?: boolean;
  keyTakeaway?: string;
  isGeneratingTakeaway?: boolean;
}

export interface Presentation {
  slides: Slide[];
}

export interface FilePart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export interface Source {
  web: {
    uri: string;
    title: string;
  };
}

// Defines the structure for a presentation design template.
type SlideMasterProps = {
  title: string;
  background: { color: string; } | { path: string; };
  objects?: any[];
  slideNumber?: { x: number; y: number; color?: string; };
  slideLayouts?: any[];
};

export interface PresentationTemplate {
  id: string;
  name: string;
  preview: {
    backgroundColor: string;
    headerColor: string;
    titleColor: string;
    textColor: string;
  };
  master: SlideMasterProps;
}


// New types for project management and version history

export interface AppState {
  generationStep: 'input' | 'outline' | 'slides';
  inputText: string;
  uploadedFileNames: string[]; // We can't save File objects, so we save names as a reference
  outline: string;
  sources: Source[];
  slides: Slide[];
  selectedTemplateId: string;
  tone: string;
}

export interface HistoryCheckpoint {
  timestamp: number;
  action: string;
  state: AppState;
}

export interface PresentationProject {
  id: string;
  title: string;
  createdAt: number;
  lastModified: number;
  history: HistoryCheckpoint[];
}

export interface ManagedFile {
  id: string;
  file: File;
  status: 'loading' | 'completed' | 'error';
  progress: number;
  data?: string;
  mimeType?: string;
}