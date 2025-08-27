import { useState, useCallback, useMemo, useEffect } from 'react';
import { Slide as SlideType, Presentation, FilePart, Source, PresentationProject, AppState, ManagedFile } from '../types';
import { generateOutline, generateSlidesStream, generateImageForSlide, editSlide, generateSpeakerNotes, generateKeyTakeaway, expandSlide } from '../services/geminiService';
import { convertFileToBase64WithProgress, fetchImageAsBase64 } from '../utils/fileUtils';
import { templates } from '../templates';

interface PresentationEditorProps {
    presentation: PresentationProject;
    onUpdatePresentation: (id: string, updates: Partial<PresentationProject>) => void;
    onAddCheckpoint: (id:string, action: string, state: AppState) => void;
}

const usePresentationEditorState = ({ presentation, onUpdatePresentation, onAddCheckpoint }: PresentationEditorProps) => {
  const latestState = useMemo(() => presentation.history[presentation.history.length - 1].state, [presentation]);

  const [generationStep, setGenerationStep] = useState<'input' | 'outline' | 'slides'>(latestState.generationStep);
  const [inputText, setInputText] = useState<string>(latestState.inputText);
  const [managedFiles, setManagedFiles] = useState<ManagedFile[]>([]);
  const [outline, setOutline] = useState<string>(latestState.outline);
  const [sources, setSources] = useState<Source[]>(latestState.sources);
  const [slides, setSlides] = useState<SlideType[]>(latestState.slides);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(latestState.selectedTemplateId);
  const [tone, setTone] = useState<string>(latestState.tone);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(slides[0]?.id || null);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [stylingSlideId, setStylingSlideId] = useState<string | null>(null);
  const [historySlideId, setHistorySlideId] = useState<string | null>(null);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [presentationTitle, setPresentationTitle] = useState(presentation.title);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const selectedTemplate = useMemo(() => templates.find(t => t.id === selectedTemplateId) || templates[0], [selectedTemplateId]);
  
  const currentState = useMemo((): AppState => ({
    generationStep, inputText, uploadedFileNames: managedFiles.map(f => f.file.name),
    outline, sources, slides, selectedTemplateId, tone,
  }), [generationStep, inputText, managedFiles, outline, sources, slides, selectedTemplateId, tone]);

  // Auto-save effect
  useEffect(() => {
    // Don't save while an AI operation is in progress or if there's no presentation history
    if (isLoading || presentation.history.length === 0) {
      return;
    }

    setAutoSaveStatus('saving');

    const handler = setTimeout(() => {
      const latestHistory = presentation.history[presentation.history.length - 1];
      
      // Update the state of the latest checkpoint without creating a new history entry.
      const updatedHistory = [
        ...presentation.history.slice(0, -1),
        { ...latestHistory, state: currentState }
      ];

      onUpdatePresentation(presentation.id, { history: updatedHistory });
      setAutoSaveStatus('saved');

      // Reset status back to idle after a moment for a clean UI
      const resetHandler = setTimeout(() => setAutoSaveStatus('idle'), 2000);
      return () => clearTimeout(resetHandler);

    }, 1500); // Debounce time: 1.5 seconds

    return () => {
      clearTimeout(handler);
    };
  }, [currentState, presentation.id, presentation.history, onUpdatePresentation, isLoading]);


  const addCheckpoint = useCallback((action: string) => {
    onAddCheckpoint(presentation.id, action, currentState);
  }, [presentation.id, onAddCheckpoint, currentState]);
  
  const handleFilesChange = useCallback((newFiles: File[]) => {
    const newManagedFiles: ManagedFile[] = newFiles.map(file => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      file,
      status: 'loading',
      progress: 0,
    }));

    setManagedFiles(prev => [...prev, ...newManagedFiles]);

    newManagedFiles.forEach(managedFile => {
      convertFileToBase64WithProgress(managedFile.file, (progress) => {
        setManagedFiles(prev => prev.map(mf => 
          mf.id === managedFile.id ? { ...mf, progress } : mf
        ));
      }).then(({ data, mimeType }) => {
        setManagedFiles(prev => prev.map(mf => 
          mf.id === managedFile.id ? { ...mf, status: 'completed', progress: 100, data, mimeType } : mf
        ));
      }).catch(error => {
        console.error("File conversion error:", error);
        setManagedFiles(prev => prev.map(mf => 
          mf.id === managedFile.id ? { ...mf, status: 'error', progress: 0 } : mf
        ));
      });
    });
  }, []);

  const handleRemoveFile = useCallback((idToRemove: string) => {
    setManagedFiles(prevFiles => prevFiles.filter(mf => mf.id !== idToRemove));
  }, []);

  const handleSaveTitle = useCallback(() => {
    if (presentationTitle.trim() && presentationTitle !== presentation.title) {
      onUpdatePresentation(presentation.id, { title: presentationTitle.trim() });
    }
    setIsEditingTitle(false);
  }, [presentation.id, presentation.title, presentationTitle, onUpdatePresentation]);

  const handleGenerateOutline = useCallback(async () => {
    const readyFiles = managedFiles.filter(mf => mf.status === 'completed');
    if (isLoading || (!inputText.trim() && readyFiles.length === 0)) return;

    const loadingFilesCount = managedFiles.filter(mf => mf.status === 'loading').length;
    if (loadingFilesCount > 0) {
        setError(`Please wait for ${loadingFilesCount} file(s) to finish processing.`);
        return;
    }

    setIsLoading(true); setLoadingMessage('Enhancing your idea...'); setError(null);
    setSlides([]); setOutline(''); setSources([]);
    try {
      const fileParts: FilePart[] = readyFiles
        .filter(mf => mf.data && mf.mimeType)
        .map(mf => ({
            inlineData: {
                data: mf.data!,
                mimeType: mf.mimeType!,
            }
        }));

      const result = await generateOutline(inputText, fileParts);
      const nextStep = 'outline';

      onUpdatePresentation(presentation.id, { title: result.title });
      setPresentationTitle(result.title);
      setOutline(result.outline);
      setSources(result.sources);
      setGenerationStep(nextStep);
      
      onAddCheckpoint(presentation.id, 'Generated Outline & Title', {
        ...currentState, 
        generationStep: nextStep, 
        outline: result.outline, 
        sources: result.sources, 
        slides: [], 
        uploadedFileNames: managedFiles.map(f => f.file.name),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false); setLoadingMessage('');
    }
  }, [inputText, managedFiles, isLoading, presentation.id, onAddCheckpoint, currentState, onUpdatePresentation]);

  const handleGenerateSlidesFromOutline = useCallback(async () => {
    if (isLoading || !outline) return;

    setIsLoading(true);
    setError(null);
    setSlides([]);
    const nextStep = 'slides';
    setGenerationStep(nextStep);
    
    const readyFiles = managedFiles.filter(mf => mf.status === 'completed' && mf.data && mf.mimeType);
    const fileParts: FilePart[] = readyFiles.map(mf => ({
        inlineData: {
            data: mf.data!,
            mimeType: mf.mimeType!,
        }
    }));
    
    let finalSlides: SlideType[] = [];

    try {
        // Part 1: Stream slide content for a live preview experience
        setLoadingMessage('Generating slide content...');
        const contentStream = generateSlidesStream(inputText, fileParts, outline, tone);
        
        for await (const slideContent of contentStream) {
            const newSlide: SlideType = {
                ...slideContent,
                // FIX: Ensure bulletPoints is always an array to prevent rendering errors.
                bulletPoints: slideContent.bulletPoints || [],
                id: `slide_${Date.now()}_${Math.random()}`,
                isLoadingImage: !!slideContent.imagePrompt || !!slideContent.imageUrl,
                layout: (slideContent.imagePrompt || slideContent.imageUrl) ? 'DEFAULT' : 'TITLE_ONLY',
            };
            setSlides(prev => {
              finalSlides = [...prev, newSlide];
              if (prev.length === 0) {
                setSelectedSlideId(newSlide.id);
              }
              return finalSlides;
            });
        }
        
        onAddCheckpoint(presentation.id, 'Generated Slide Content', { ...currentState, generationStep: nextStep, slides: finalSlides });

        // Part 2: Fetch or generate images sequentially
        const slidesThatNeedVisuals = finalSlides.filter(s => s.imageUrl || s.imagePrompt);
        let visualCounter = 0;

        for (const slide of slidesThatNeedVisuals) {
            visualCounter++;
            setLoadingMessage(`Processing visuals (${visualCounter} of ${slidesThatNeedVisuals.length})...`);
            
            let imageData = "";
            if (slide.imageUrl) {
                try {
                    imageData = await fetchImageAsBase64(slide.imageUrl);
                } catch (e) {
                    console.warn(`Failed to fetch image from ${slide.imageUrl}. Will try to generate one if prompt exists.`, e);
                    // Fallback to generation if fetch fails and a prompt exists
                    if (slide.imagePrompt) {
                        imageData = await generateImageForSlide(slide.imagePrompt);
                    }
                }
            } else if (slide.imagePrompt) {
                imageData = await generateImageForSlide(slide.imagePrompt);
            }
            
            setSlides(prevSlides => {
                const updatedSlides = prevSlides.map(s => s.id === slide.id ? { ...s, image: imageData, isLoadingImage: false } : s);
                finalSlides = updatedSlides;
                return updatedSlides;
            });
        }
        
        if (slidesThatNeedVisuals.length > 0) {
          onAddCheckpoint(presentation.id, 'Processed Slide Visuals', { ...currentState, generationStep: nextStep, slides: finalSlides });
        }

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred during slide generation.');
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [outline, inputText, managedFiles, isLoading, tone, presentation.id, onAddCheckpoint, currentState]);

  const handleEditSlide = async (prompt: string) => {
    if (!editingSlideId) return;
    const originalSlide = slides.find(s => s.id === editingSlideId);
    if (!originalSlide) return;
    setSlides(prev => prev.map(s => s.id === editingSlideId ? { ...s, isLoadingImage: true } : s));
    setEditingSlideId(null);
    try {
      const updatedParts = await editSlide(originalSlide, prompt);
      
      // FIX: Prevent null/undefined from overwriting the bulletPoints array.
      if (updatedParts.bulletPoints === null || typeof updatedParts.bulletPoints === 'undefined') {
        delete updatedParts.bulletPoints;
      }

      const newSlides = slides.map(s => s.id === editingSlideId ? { ...s, ...updatedParts, isLoadingImage: false } : s);
      setSlides(newSlides);
      addCheckpoint(`Edited Slide: ${originalSlide.title}`);
    } catch (err) {
      setError(err instanceof Error ? `Failed to edit slide: ${err.message}` : 'An unknown error occurred during edit.');
      setSlides(prev => prev.map(s => s.id === editingSlideId ? { ...originalSlide, isLoadingImage: false } : s));
    }
  };

  const handleGenerateImageForSlide = async (slideId: string) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide || !slide.imagePrompt) return;

    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isLoadingImage: true } : s));

    try {
        const imageData = await generateImageForSlide(slide.imagePrompt);
        setSlides(prev => prev.map(s => s.id === slideId ? { ...s, image: imageData, isLoadingImage: false } : s));
        addCheckpoint(`Generated Image for Slide: ${slide.title}`);
    } catch (err) {
        setError(err instanceof Error ? `Failed to generate image: ${err.message}` : 'An unknown error occurred.');
        setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isLoadingImage: false } : s));
    }
  };

  const handleUpdateSlideLayout = (layout: string) => {
    if (!stylingSlideId) return;
    const slideTitle = slides.find(s => s.id === stylingSlideId)?.title;
    setSlides(prev => prev.map(s => s.id === stylingSlideId ? { ...s, layout } : s));
    setStylingSlideId(null);
    addCheckpoint(`Changed Layout for Slide: ${slideTitle}`);
  };

  const handleGenerateSpeakerNotesForSlide = async (slideId: string) => {
    const slide = slides.find(s => s.id === slideId); if (!slide) return;
    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isGeneratingNotes: true } : s));
    try {
      const notes = await generateSpeakerNotes({ title: slide.title, bulletPoints: slide.bulletPoints });
      setSlides(prev => prev.map(s => s.id === slideId ? { ...s, speakerNotes: notes, isGeneratingNotes: false } : s));
      addCheckpoint(`Generated Notes for Slide: ${slide.title}`);
    } catch (error) {
      setSlides(prev => prev.map(s => s.id === slideId ? { ...s, speakerNotes: "Error generating notes.", isGeneratingNotes: false } : s));
    }
  };

  const handleGenerateKeyTakeaway = async (slideId: string) => {
    const slide = slides.find(s => s.id === slideId); if (!slide) return;
    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, isGeneratingTakeaway: true } : s));
    try {
      const takeaway = await generateKeyTakeaway({ title: slide.title, bulletPoints: slide.bulletPoints });
      setSlides(prev => prev.map(s => s.id === slideId ? { ...s, keyTakeaway: takeaway, isGeneratingTakeaway: false } : s));
      addCheckpoint(`Generated Takeaway for Slide: ${slide.title}`);
    } catch (error) {
      setSlides(prev => prev.map(s => s.id === slideId ? { ...s, keyTakeaway: "Error.", isGeneratingTakeaway: false } : s));
    }
  };

  const handleExpandSlide = async (slideId: string) => {
    const slide = slides.find(s => s.id === slideId); if (!slide) return;
    setIsLoading(true); setLoadingMessage(`Expanding slide: "${slide.title}"...`); setError(null);
    try {
      const newSlidesFromApi = await expandSlide({ title: slide.title, bulletPoints: slide.bulletPoints });
      
      // FIX: Ensure the API response is an array before processing to prevent crashes.
      if (!Array.isArray(newSlidesFromApi)) {
        console.error("expandSlide API did not return an array:", newSlidesFromApi);
        throw new Error("Failed to expand slide: The AI returned an unexpected data format.");
      }

      const newSlides: SlideType[] = newSlidesFromApi.map(s => ({ 
        ...s, 
        // FIX: Ensure bulletPoints is always an array to prevent rendering errors.
        bulletPoints: s.bulletPoints || [],
        id: `slide_${Date.now()}_${Math.random()}`, 
        isLoadingImage: !!s.imagePrompt, 
        layout: s.imagePrompt ? 'DEFAULT' : 'TITLE_ONLY' 
      }));
      
      const slideIndex = slides.findIndex(s => s.id === slideId);
      const updatedSlides = [...slides];
      updatedSlides.splice(slideIndex + 1, 0, ...newSlides);
      setSlides(updatedSlides);
      addCheckpoint(`Expanded Slide: ${slide.title}`);
      
      setLoadingMessage('Generating images for new slides...');
      const imagePromises = newSlides.map(newSlide => 
        newSlide.imagePrompt ? generateImageForSlide(newSlide.imagePrompt).then(imageData => {
          setSlides(prev => prev.map(s => s.id === newSlide.id ? { ...s, image: imageData, isLoadingImage: false } : s));
        }) : Promise.resolve()
      );
      await Promise.all(imagePromises);
      addCheckpoint('Generated Images for Expanded Slides');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during slide expansion.');
    } finally {
      setIsLoading(false); setLoadingMessage('');
    }
  };

  const handleRestoreSlideState = (slideState: SlideType) => {
    setSlides(prev => prev.map(s => s.id === slideState.id ? slideState : s));
    addCheckpoint(`Restored Slide: ${slideState.title}`);
    setHistorySlideId(null);
  };

  const handleDownload = useCallback(() => {
    if (slides.length === 0 || !selectedTemplate) return;
    const PptxGenJS = (window as any).PptxGenJS;
    if (!PptxGenJS) { setError('Could not download presentation. The presentation library failed to load.'); return; }
    const pres = new PptxGenJS();
    pres.layout = 'LAYOUT_WIDE';
    pres.defineSlideMaster(selectedTemplate.master);
    slides.forEach(slideData => {
      const layoutName = slideData.layout || (slideData.image ? 'DEFAULT' : 'TITLE_ONLY');
      const slide = pres.addSlide({ masterName: selectedTemplate.master.title, layoutName: layoutName, notes: slideData.speakerNotes || undefined });
      slide.addText(slideData.title, { placeholder: 'title' });
      if (layoutName !== 'TITLE_ONLY') {
        const bulletPoints = [...slideData.bulletPoints];
        if (slideData.keyTakeaway) bulletPoints.push(`\nKey Takeaway: ${slideData.keyTakeaway}`);
        if (bulletPoints.length > 0) slide.addText(bulletPoints.join('\n'), { placeholder: 'body' });
        if (slideData.image) slide.addImage({ data: `data:image/jpeg;base64,${slideData.image}`, placeholder: 'image' });
      }
    });
    pres.writeFile({ fileName: `${presentation.title.replace(/\s/g, '_')}.pptx` });
  }, [slides, selectedTemplate, presentation.title]);

  const hasContent = useMemo(() => inputText.trim().length > 0 || managedFiles.length > 0, [inputText, managedFiles]);
  const editingSlide = useMemo(() => slides.find(s => s.id === editingSlideId), [slides, editingSlideId]);
  const stylingSlide = useMemo(() => slides.find(s => s.id === stylingSlideId), [slides, stylingSlideId]);

  return {
    state: {
      generationStep, inputText, managedFiles, outline, sources, slides, selectedTemplateId, tone,
      isLoading, loadingMessage, selectedSlideId, presentationTitle
    },
    handlers: {
      setInputText, setManagedFiles, setOutline, setSources, setSlides, setSelectedTemplateId, setTone,
      setSelectedSlideId, handleFilesChange, handleRemoveFile, handleSaveTitle, handleGenerateOutline,
      handleGenerateSlidesFromOutline, handleEditSlide, handleUpdateSlideLayout, handleGenerateSpeakerNotesForSlide,
      handleGenerateKeyTakeaway, handleExpandSlide, handleRestoreSlideState, handleDownload, setPresentationTitle,
      setIsEditingTitle, handleGenerateImageForSlide,
    },
    modals: {
      editingSlideId, setEditingSlideId, stylingSlideId, setStylingSlideId, historySlideId, setHistorySlideId,
      isHistoryPanelOpen, setIsHistoryPanelOpen
    },
    derivedState: {
      hasContent, error, editingSlide, stylingSlide, selectedTemplate, isEditingTitle, autoSaveStatus,
    }
  };
};

export default usePresentationEditorState;