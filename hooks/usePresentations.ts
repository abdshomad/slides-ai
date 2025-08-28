import { useState, useEffect, useCallback, useMemo } from 'react';
// FIX: Correct import path for types
import { PresentationProject, AppState, HistoryCheckpoint } from '../types/index';
import { templates } from '../templates/index';
import { loadPresentations, savePresentations } from '../services/presentationStorageService';

const createNewPresentation = (title: string): PresentationProject => {
  const now = Date.now();
  const initialState: AppState = {
    generationStep: 'input',
    inputText: '',
    uploadedFileNames: [],
    outline: '',
    sources: [],
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { presentations, currentPresentationId } = loadPresentations();
    setPresentations(presentations);
    setCurrentPresentationId(currentPresentationId);
    setIsLoading(false);
  }, []);

  const createPresentation = useCallback((title?: string) => {
    const newTitle = title || `Untitled Presentation ${presentations.length + 1}`;
    const newPresentation = createNewPresentation(newTitle);
    setPresentations(prev => {
      const updated = [...prev, newPresentation];
      savePresentations(updated, newPresentation.id);
      return updated;
    });
    setCurrentPresentationId(newPresentation.id);
  }, [presentations.length]);

  const deletePresentation = useCallback((id: string) => {
    setPresentations(prev => {
      const updated = prev.filter(p => p.id !== id);
      const newCurrentId = currentPresentationId === id ? null : currentPresentationId;
      savePresentations(updated, newCurrentId);
      if (currentPresentationId === id) {
        setCurrentPresentationId(null);
      }
      return updated;
    });
  }, [currentPresentationId]);
  
  const updatePresentation = useCallback((id: string, updates: Partial<PresentationProject>) => {
    setPresentations(prev => {
      const newPresentations = prev.map(p =>
        p.id === id ? { ...p, ...updates, lastModified: Date.now() } : p
      );
      savePresentations(newPresentations, currentPresentationId);
      return newPresentations;
    });
  }, [currentPresentationId]);


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
      savePresentations(newPresentations, id);
      return newPresentations;
    });
  }, []);

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
      savePresentations(newPresentations, id);
      return newPresentations;
    });
  }, []);
  
  const selectPresentation = useCallback((id: string) => {
    setCurrentPresentationId(id);
    savePresentations(presentations, id);
  }, [presentations]);

  const clearCurrentPresentation = useCallback(() => {
    setCurrentPresentationId(null);
    savePresentations(presentations, null);
  }, [presentations]);

  const currentPresentation = presentations.find(p => p.id === currentPresentationId) || null;

  const actions = useMemo(() => ({
    createPresentation,
    deletePresentation,
    updatePresentation,
    addCheckpoint,
    rollbackToCheckpoint,
    selectPresentation,
    clearCurrentPresentation
  }), [
    createPresentation,
    deletePresentation,
    updatePresentation,
    addCheckpoint,
    rollbackToCheckpoint,
    selectPresentation,
    clearCurrentPresentation
  ]);

  return {
    presentations,
    currentPresentation,
    isLoading,
    actions,
  };
};

export default usePresentations;