import React, { useCallback } from 'react';
import FileUpload from '../FileUpload';
import Loader from '../Loader';
import { MagicIcon } from '../icons/MagicIcon';
import { MicrophoneIcon } from '../icons/MicrophoneIcon';
// FIX: Correct import path for types
import { ManagedFile } from '../../types/index';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import LoadingProgress from './LoadingProgress';

interface InputStepProps {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  managedFiles: ManagedFile[];
  onFilesChange: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onGenerateOutline: () => void;
  isLoading: boolean;
  loadingMessage: string;
  hasContent: boolean;
  elapsedTime: number;
  estimatedTime: number;
}

const InputStep: React.FC<InputStepProps> = ({
  inputText,
  setInputText,
  managedFiles,
  onFilesChange,
  onRemoveFile,
  onGenerateOutline,
  isLoading,
  loadingMessage,
  hasContent,
  elapsedTime,
  estimatedTime,
}) => {

  const onTranscript = useCallback((transcript: string) => {
    // Use the functional update form to avoid dependency on `inputText`
    // This prevents the speech recognition hook from re-initializing on every text change.
    setInputText(prev => prev + transcript);
  }, [setInputText]);

  const { isListening, hasSupport, handleToggleListening } = useSpeechRecognition({ onTranscript });

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <label htmlFor="idea-input" className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Start with your core idea
          </label>
           <div className="relative flex-grow">
              <textarea
                id="idea-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe your presentation topic, key points, and target audience. For example: 'Create a 5-slide presentation on the benefits of remote work for small businesses.'"
                className="w-full h-full min-h-[250px] p-4 pr-12 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg resize-y focus:ring-2 focus:ring-pink-500 focus:outline-none transition-shadow"
                aria-label="Presentation idea input"
              />
              {hasSupport && (
                 <button
                    onClick={handleToggleListening}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isListening ? 'bg-pink-600 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                    <MicrophoneIcon className="w-5 h-5" />
                </button>
              )}
           </div>
        </div>
        <div className="flex flex-col">
          <label className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Or provide files as context
          </label>
          <div className="flex-grow">
            <FileUpload 
              onFilesChange={onFilesChange}
              managedFiles={managedFiles}
              onRemoveFile={onRemoveFile}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        {isLoading ? (
            <div className="inline-block" role="status">
                <div className="inline-flex items-center justify-center px-8 py-4">
                    <Loader />
                    <span className="ml-3 text-lg font-medium">{loadingMessage}</span>
                </div>
                <LoadingProgress elapsedTime={elapsedTime} estimatedTime={estimatedTime} />
            </div>
        ) : (
          <button
            onClick={onGenerateOutline}
            disabled={!hasContent || isLoading}
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            <MagicIcon className="w-6 h-6 mr-3" />
            Generate Outline
          </button>
        )}
      </div>
    </div>
  );
};

export default InputStep;