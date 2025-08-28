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

export interface GenerationStats {
    sourcesAnalyzed: number;
    imagesSourced: number;
    imagesToGenerate: number;
    slidesCreated: number;
}

export interface FactCheckResult {
  title: string;
  bulletPoints: string[];
  summaryOfChanges: string;
}
