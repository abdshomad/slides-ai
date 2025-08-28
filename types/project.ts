

import { Slide } from './presentation';
import { Source } from './api';

// FIX: Define and export Theme type
export type Theme = 'light' | 'dark' | 'system';

export interface BrandKit {
  logo: string | null; // base64 data URL
  primaryColor: string; // hex
  secondaryColor: string; // hex
  primaryFont: string;
  secondaryFont: string;
}

export interface AppState {
  generationStep: 'input' | 'outline' | 'slides';
  inputText: string;
  uploadedFileNames: string[];
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