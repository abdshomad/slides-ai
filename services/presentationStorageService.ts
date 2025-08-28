// FIX: Correct import path for types
import { PresentationProject } from '../types/index';

const STORAGE_KEY = 'ai_presentations';

/**
 * Loads presentation data from localStorage.
 * @returns An object containing the array of presentations and the ID of the current presentation.
 */
export const loadPresentations = (): { presentations: PresentationProject[], currentPresentationId: string | null } => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return {
        presentations: parsedData.presentations || [],
        currentPresentationId: parsedData.currentPresentationId || null,
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
export const savePresentations = (presentations: PresentationProject[], currentPresentationId: string | null) => {
  try {
    const dataToSave = {
      presentations,
      currentPresentationId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error("Failed to save presentations to localStorage", error);
  }
};