import { useState, useCallback } from 'react';
// FIX: Correct import path for types
import { ManagedFile } from '../types/index';
import { convertFileToBase64WithProgress } from '../utils/fileUtils';

const useFileManager = () => {
  const [managedFiles, setManagedFiles] = useState<ManagedFile[]>([]);

  const handleFilesChange = useCallback(async (files: File[]) => {
    const newManagedFiles: ManagedFile[] = files.map(file => ({
        id: `${file.name}-${Date.now()}`,
        file,
        status: 'loading',
        progress: 0
    }));

    setManagedFiles(prev => [...prev, ...newManagedFiles]);

    for (const mf of newManagedFiles) {
        try {
            const { data, mimeType } = await convertFileToBase64WithProgress(mf.file, (progress) => {
                setManagedFiles(prev => prev.map(f => f.id === mf.id ? { ...f, progress } : f));
            });
            setManagedFiles(prev => prev.map(f => f.id === mf.id ? { ...f, status: 'completed', data, mimeType } : f));
        } catch (error) {
            console.error("File conversion error:", error);
            setManagedFiles(prev => prev.map(f => f.id === mf.id ? { ...f, status: 'error' } : f));
        }
    }
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setManagedFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  return {
    managedFiles,
    handleFilesChange,
    handleRemoveFile,
  };
};

export default useFileManager;