import { useState, useEffect, useCallback, useMemo } from 'react';
import { PresentationProject, AppState, HistoryCheckpoint } from '../types';
import { templates } from '../templates';

const STORAGE_KEY = 'ai_presentations';

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
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setPresentations(parsedData.presentations || []);
        setCurrentPresentationId(parsedData.currentPresentationId || null);
      }
    } catch (error) {
      console.error("Failed to load presentations from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveData = useCallback((newPresentations: PresentationProject[], newCurrentId: string | null) => {
    try {
      const dataToSave = {
        presentations: newPresentations,
        currentPresentationId: newCurrentId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Failed to save presentations to localStorage", error);
    }
  }, []);

  const createPresentation = useCallback((title?: string) => {
    const newTitle = title || `Untitled Presentation ${presentations.length + 1}`;
    const newPresentation = createNewPresentation(newTitle);
    setPresentations(prev => {
      const updated = [...prev, newPresentation];
      saveData(updated, newPresentation.id);
      return updated;
    });
    setCurrentPresentationId(newPresentation.id);
  }, [saveData, presentations.length]);

  const deletePresentation = useCallback((id: string) => {
    setPresentations(prev => {
      const updated = prev.filter(p => p.id !== id);
      const newCurrentId = currentPresentationId === id ? null : currentPresentationId;
      saveData(updated, newCurrentId);
      if (currentPresentationId === id) {
        setCurrentPresentationId(null);
      }
      return updated;
    });
  }, [currentPresentationId, saveData]);
  
  const updatePresentation = useCallback((id: string, updates: Partial<PresentationProject>) => {
    setPresentations(prev => {
      const newPresentations = prev.map(p =>
        p.id === id ? { ...p, ...updates, lastModified: Date.now() } : p
      );
      saveData(newPresentations, currentPresentationId);
      return newPresentations;
    });
  }, [currentPresentationId, saveData]);


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
      saveData(newPresentations, id);
      return newPresentations;
    });
  }, [saveData]);

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
      saveData(newPresentations, id);
      return newPresentations;
    });
  }, [saveData]);
  
  const selectPresentation = useCallback((id: string) => {
    setCurrentPresentationId(id);
    saveData(presentations, id);
  }, [presentations, saveData]);

  const clearCurrentPresentation = useCallback(() => {
    setCurrentPresentationId(null);
    saveData(presentations, null);
  }, [presentations, saveData]);

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