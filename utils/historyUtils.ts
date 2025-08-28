// FIX: Correct import path for types
import { HistoryCheckpoint, AppState, Slide as SlideType } from '../types/index';

const findSlideInState = (state: AppState, slideId: string): SlideType | undefined => {
  return state.slides.find(s => s.id === slideId);
};

// Use a simplified JSON.stringify for object comparison to detect meaningful changes
const simpleStringify = (obj: any) => {
    if (!obj) return '';
    const { title, bulletPoints, image, layout, speakerNotes, keyTakeaway } = obj;
    return JSON.stringify({ title, bulletPoints, image, layout, speakerNotes, keyTakeaway });
};

/**
 * Processes the entire project history to extract a chronological, de-duplicated history for a single slide.
 * @param history The array of all project checkpoints.
 * @param slideId The ID of the slide to find the history for.
 * @returns An array of objects, each containing the checkpoint and the unique slide state at that time.
 */
export const getSlideHistory = (history: HistoryCheckpoint[], slideId: string) => {
    if (!slideId) return [];

    const filteredHistory: { checkpoint: HistoryCheckpoint; slideState: SlideType }[] = [];
    let lastSlideStateString: string | null = null;

    for (const checkpoint of history) {
      const slideInThisState = findSlideInState(checkpoint.state, slideId);

      if (slideInThisState) {
        const currentSlideStateString = simpleStringify(slideInThisState);
        // Only add the checkpoint if the slide's state has actually changed
        if (currentSlideStateString !== lastSlideStateString) {
          filteredHistory.push({ checkpoint, slideState: slideInThisState });
          lastSlideStateString = currentSlideStateString;
        }
      }
    }
    return filteredHistory.reverse(); // Show newest first
};