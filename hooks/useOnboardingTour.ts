import { useState, useCallback } from 'react';
// FIX: Corrected import path for the View type.
import { View } from '../types/index';

export const tourSteps = [
  {
    target: '[data-tour-id="text-input"]',
    title: 'Start with an Idea',
    content: 'Simply type your presentation topic, key points, or paste your raw notes here. The more detail you provide, the better!',
    view: 'main' as View,
  },
  {
    target: '[data-tour-id="file-upload"]',
    title: 'Add Context Files',
    content: 'You can also drag and drop documents like PDFs or text files to give the AI more context for your presentation.',
    view: 'main' as View,
  },
  {
    target: '[data-tour-id="generate-outline-button"]',
    title: 'Generate Your Outline',
    content: "Once you're ready, click here. The AI will research your topic and create a structured outline for your review.",
    view: 'main' as View,
  },
  {
    target: '[data-tour-id="ai-editing-tools"]',
    title: 'Powerful AI Editing Tools',
    content: 'After your slides are generated, use this toolbar to edit content with natural language, change styles, generate speaker notes, and much more!',
    view: 'sample' as View,
  },
  {
    target: '[data-tour-id="export-button"]',
    title: 'Export Your Presentation',
    content: "When you're happy with the result, click here to download your presentation as a standard .pptx file.",
    view: 'sample' as View,
  },
] as const;

export const useOnboardingTour = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  const startTour = useCallback(() => {
    setTourStepIndex(0);
    setIsTourOpen(true);
  }, []);

  const nextStep = useCallback(() => setTourStepIndex(i => Math.min(i + 1, tourSteps.length - 1)), []);
  const prevStep = useCallback(() => setTourStepIndex(i => Math.max(i - 1, 0)), []);
  const skipTour = useCallback(() => {
    setIsTourOpen(false);
    localStorage.setItem('tourCompleted', 'true');
  }, []);

  return {
    isTourOpen,
    tourStep: tourSteps[tourStepIndex],
    tourStepIndex,
    totalSteps: tourSteps.length,
    startTour,
    nextStep,
    prevStep,
    skipTour,
  };
};