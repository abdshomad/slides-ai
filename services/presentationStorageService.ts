

// FIX: Correct import path for types
import { PresentationProject, BrandKit } from '../types/index';

const STORAGE_KEY = 'ai_presentations';

interface StoredData {
    presentations: PresentationProject[];
    currentPresentationId: string | null;
    brandKit: BrandKit;
}

/**
 * Loads presentation data from localStorage.
 * @returns An object containing the array of presentations and the ID of the current presentation.
 */
export const loadPresentations = (): Partial<StoredData> => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return {
        presentations: parsedData.presentations || [],
        currentPresentationId: parsedData.currentPresentationId || null,
        brandKit: parsedData.brandKit,
      };
    }
  } catch (error) {
    console.error("Failed to load presentations from localStorage", error);
  }
  return { presentations: [], currentPresentationId: null };
};

/**
 * Saves presentation data to localStorage.
 * @param presentations The array of presentation projects to save.
 * @param currentPresentationId The ID of the currently active presentation.
 */
export const savePresentations = (dataToSave: StoredData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error("Failed to save presentations to localStorage", error);
  }
};
