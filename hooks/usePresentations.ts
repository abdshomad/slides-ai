



import { useState, useEffect, useCallback, useMemo } from 'react';
// FIX: Correct import path for types
import { PresentationProject, AppState, HistoryCheckpoint, BrandKit } from '../types/index';
import { templates } from '../templates/index';
import { loadPresentations, savePresentations } from '../services/presentationStorageService';
import { defaultBrandKit } from '../utils/defaults';

const createNewPresentation = (title: string): PresentationProject => {
  const now = Date.now();
  const initialState: AppState = {
    generationStep: 'input',
    inputText: '',
    uploadedFileNames: [],
    outline: '',
    sources: [],
    sourcedImages: [],
    slides: [],
    selectedTemplateId: templates[0]?.id || '',
    tone: 'Professional',
  };
  const initialCheckpoint: HistoryCheckpoint = {
    timestamp: now,
    action: 'Created Presentation',
    state: initialState,
  };
  return {
    id: `pres_${now}`,
    title,
    createdAt: now,
    lastModified: now,
    history: [initialCheckpoint],
  };
};

const usePresentations = () => {
  const [presentations, setPresentations] = useState<PresentationProject[]>([]);
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(null);
  const [brandKit, setBrandKit] = useState<BrandKit>(defaultBrandKit);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedData = loadPresentations();
    setPresentations(loadedData.presentations || []);
    setCurrentPresentationId(loadedData.currentPresentationId || null);
    // Merge loaded brand kit with defaults to ensure new properties are present
    setBrandKit(loadedData.brandKit ? { ...defaultBrandKit, ...loadedData.brandKit } : defaultBrandKit);
    setIsLoading(false);
  }, []);

  const createPresentation = useCallback((title?: string) => {
    const newTitle = title || `Untitled Presentation ${presentations.length + 1}`;
    const newPresentation = createNewPresentation(newTitle);
    setPresentations(prev => {
      const updated = [...prev, newPresentation];
      savePresentations({ presentations: updated, currentPresentationId: newPresentation.id, brandKit });
      return updated;
    });
    setCurrentPresentationId(newPresentation.id);
  }, [presentations.length, brandKit]);

  const deletePresentation = useCallback((id: string) => {
    setPresentations(prev => {
      const updated = prev.filter(p => p.id !== id);
      const newCurrentId = currentPresentationId === id ? null : currentPresentationId;
      savePresentations({ presentations: updated, currentPresentationId: newCurrentId, brandKit });
      if (currentPresentationId === id) {
        setCurrentPresentationId(null);
      }
      return updated;
    });
  }, [currentPresentationId, brandKit]);
  
  const updatePresentation = useCallback((id: string, updates: Partial<PresentationProject>) => {
    setPresentations(prev => {
      const newPresentations = prev.map(p =>
        p.id === id ? { ...p, ...updates, lastModified: Date.now() } : p
      );
      savePresentations({ presentations: newPresentations, currentPresentationId, brandKit });
      return newPresentations;
    });
  }, [currentPresentationId, brandKit]);


  const addCheckpoint = useCallback((id: string, action: string, state: AppState) => {
    setPresentations(prev => {
      const newPresentations = prev.map(p => {
        if (p.id === id) {
          const newCheckpoint: HistoryCheckpoint = {
            timestamp: Date.now(),
            action,
            state,
          };
          return {
            ...p,
            history: [...p.history, newCheckpoint],
            lastModified: newCheckpoint.timestamp,
          };
        }
        return p;
      });
      savePresentations({ presentations: newPresentations, currentPresentationId: id, brandKit });
      return newPresentations;
    });
  }, [brandKit]);

  const rollbackToCheckpoint = useCallback((id: string, checkpointIndex: number) => {
    setPresentations(prev => {
      const newPresentations = prev.map(p => {
        if (p.id === id) {
          const targetCheckpoint = p.history[checkpointIndex];
          if (!targetCheckpoint) return p;
          
          const newCheckpoint: HistoryCheckpoint = {
            timestamp: Date.now(),
            action: `Rolled back to: "${targetCheckpoint.action}"`,
            state: targetCheckpoint.state,
          };

          return {
            ...p,
            history: [...p.history, newCheckpoint],
            lastModified: newCheckpoint.timestamp,
          };
        }
        return p;
      });
      savePresentations({ presentations: newPresentations, currentPresentationId: id, brandKit });
      return newPresentations;
    });
  }, [brandKit]);
  
  const selectPresentation = useCallback((id: string) => {
    setCurrentPresentationId(id);
    savePresentations({ presentations, currentPresentationId: id, brandKit });
  }, [presentations, brandKit]);

  const clearCurrentPresentation = useCallback(() => {
    setCurrentPresentationId(null);
    savePresentations({ presentations, currentPresentationId: null, brandKit });
  }, [presentations, brandKit]);

  const updateBrandKit = useCallback((newBrandKit: BrandKit) => {
    setBrandKit(newBrandKit);
    savePresentations({ presentations, currentPresentationId, brandKit: newBrandKit });
  }, [presentations, currentPresentationId]);

  const currentPresentation = presentations.find(p => p.id === currentPresentationId) || null;

  const actions = useMemo(() => ({
    createPresentation,
    deletePresentation,
    updatePresentation,
    addCheckpoint,
    rollbackToCheckpoint,
    selectPresentation,
    clearCurrentPresentation,
    updateBrandKit
  }), [
    createPresentation,
    deletePresentation,
    updatePresentation,
    addCheckpoint,
    rollbackToCheckpoint,
    selectPresentation,
    clearCurrentPresentation,
    updateBrandKit,
  ]);

  return {
    presentations,
    currentPresentation,
    isLoading,
    brandKit,
    actions,
  };
};

export default usePresentations;