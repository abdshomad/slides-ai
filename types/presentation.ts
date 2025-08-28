export interface ChartData {
  type: 'bar' | 'line' | 'pie';
  title: string;
  data: { [key: string]: string | number }[];
  dataKey: string;
  color?: string;
}

export interface Slide {
  id: string;
  title: string;
  bulletPoints: string[];
  subtitle?: string; // For SECTION_HEADER layout
  quote?: string; // For QUOTE layout
  attribution?: string; // For QUOTE layout
  mainPoint?: string; // For MAIN_POINT_EMPHASIS layout
  subtitle1?: string; // For COMPARISON layout
  body1?: string[];   // For COMPARISON or TWO_COLUMN_TEXT layout
  subtitle2?: string; // For COMPARISON layout
  body2?: string[];   // For COMPARISON or TWO_COLUMN_TEXT layout
  imagePrompt?: string;
  imageSearchResults?: { url: string; title: string; }[];
  selectedImageUrl?: string;
  image?: string; // base64 string
  isLoadingImage?: boolean;
  layout?: string;
  speakerNotes?: string;
  isGeneratingNotes?: boolean;
  keyTakeaway?: string;
  isGeneratingTakeaway?: boolean;
  isFactChecking?: boolean;
  isExpanding?: boolean;
  isCritiquing?: boolean;
  isAdaptingAudience?: boolean;
  chartData?: ChartData;
}

export interface Presentation {
  slides: Slide[];
}

type SlideMasterProps = {
  title: string;
  background: { color: string; } | { path: string; };
  objects?: any[];
  slideNumber?: {
    x: number;
    y: number;
    w?: number | string;
    h?: number | string;
    color?: string;
    fontSize?: number;
    align?: 'left' | 'center' | 'right';
  };
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