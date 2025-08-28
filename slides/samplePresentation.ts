// FIX: Correct import path for types
import { Slide } from '../types/index';

export const samplePresentation: Slide[] = [
  {
    id: 'sample_01',
    title: 'AI Presentation Designer: The Complete Guide',
    subtitle: 'From Raw Ideas to Polished Slides',
    bulletPoints: [],
    layout: 'SECTION_HEADER',
    imagePrompt: 'A futuristic, abstract image representing artificial intelligence and creativity, with glowing neural networks and vibrant colors.'
  },
  {
    id: 'sample_02',
    title: 'What is the AI Presentation Designer?',
    bulletPoints: [
      'A sophisticated web app to transform raw ideas into polished presentations.',
      'Leverages the Google Gemini API for multimodal input (text, docs, voice).',
      'Automates the entire workflow: research, structuring, content creation, and design.',
      'Vision: To be the most intuitive and powerful AI-native tool for presentation creation.'
    ],
    layout: 'DEFAULT',
    imagePrompt: 'An illustration of a lightbulb moment, where a brain icon transitions into a polished presentation slide, symbolizing the transformation of an idea.'
  },
  {
    id: 'sample_03',
    title: 'Core Goal: Efficiency & Quality',
    bulletPoints: [
      'Drastically reduce presentation creation time by over 80%.',
      'Enhance content quality with AI-powered research and structure.',
      'Ensure information integrity with integrated fact-checking.',
      'Deliver professional aesthetics by default through templates and automation.'
    ],
    layout: 'ONE_COLUMN_TEXT',
  },
  {
    id: 'sample_04',
    title: 'Step 1: Input & Context',
    bulletPoints: [
      "Start with a core idea, paste notes, or provide detailed instructions.",
      "Upload context files like PDFs and documents for the AI to analyze.",
      "Use your microphone for speech-to-text dictation for hands-free input."
    ],
    layout: 'DEFAULT_REVERSE',
    imagePrompt: 'A dynamic illustration showing multiple input sources (a document icon, a microphone icon, a text bubble) feeding into a central AI brain icon.'
  },
  {
    id: 'sample_05',
    title: 'Step 2: Outline Generation',
    bulletPoints: [
      "AI generates a well-structured outline from your input.",
      "Utilizes Google Search for up-to-date, relevant information.",
      "Provides cited sources for verification and further reading.",
      "Review and edit the outline in a live side-by-side preview.",
      "Interactively change slide layouts directly from the outline."
    ],
    layout: 'DEFAULT',
    imagePrompt: 'A wireframe diagram of a presentation outline being automatically organized by a robotic arm, symbolizing AI-driven structuring.'
  },
  {
    id: 'sample_06',
    title: 'Step 3: Slide Generation & The Editor',
    subtitle: 'Where your presentation comes to life',
    bulletPoints: [],
    layout: 'SECTION_HEADER',
  },
  {
    id: 'sample_07',
    title: 'AI-Powered Editing & Content Tools',
    bulletPoints: [
      "**Natural Language Editing**: Modify slides by simply telling the AI what to change.",
      "**Speaker Notes**: Automatically generate detailed talking points for any slide.",
      "**Key Takeaways**: Distill the core message of a slide into a single, impactful sentence.",
      "**Slide Expansion**: Expand one slide into several new, more detailed slides.",
    ],
    layout: 'ONE_COLUMN_TEXT',
    imagePrompt: 'An icon collage showing a magic wand, a microphone, a key, and an expand/arrows icon, each representing an AI editing feature.'
  },
  {
    id: 'sample_08',
    title: 'Advanced Features: Integrity and Visuals',
    layout: 'COMPARISON',
    subtitle1: 'Fact-Checking',
    body1: [
      "Trigger an AI-powered fact-check on any slide.",
      "AI uses Google Search to verify information.",
      "View side-by-side comparisons of original vs. suggested content.",
      "Apply corrections with a single click."
    ],
    subtitle2: 'Image Sourcing',
    body2: [
      "AI finds royalty-free images via web search.",
      "Choose from up to 3 suggested images per slide.",
      "Fallback to AI image generation if no suitable search results are found.",
      "Request new images using natural language."
    ],
    bulletPoints: [],
  },
  {
    id: 'sample_09',
    title: 'Managing Your Work',
    bulletPoints: [
      "All presentations are automatically saved to your browser.",
      "View and manage all your projects from a central dashboard.",
      "Comprehensive version history allows you to roll back the entire project.",
      "View a slide-specific history to restore individual slides without affecting others."
    ],
    layout: 'DEFAULT_REVERSE',
    imagePrompt: 'An illustration of a file cabinet with a clock icon on it, symbolizing version history and project management.'
  },
  {
    id: 'sample_10',
    title: 'Final Step: Exporting',
    bulletPoints: [
      "Download your complete presentation as a standard .pptx file.",
      "The export is formatted based on your chosen professional design template.",
      "Export any single slide as a high-resolution PNG image for use elsewhere."
    ],
    layout: 'DEFAULT',
    imagePrompt: 'A sleek icon showing a presentation file being downloaded from the cloud to a laptop, with a smaller PNG icon nearby.'
  },
  {
    id: 'sample_11',
    title: 'Thank You',
    bulletPoints: [],
    layout: 'TITLE_ONLY',
  }
];