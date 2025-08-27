import React, { useState, useRef, useEffect } from 'react';
import FileUpload from '../FileUpload';
import Loader from '../Loader';
import { XCircleIcon, MagicIcon, MicrophoneIcon } from '../icons';
import { ManagedFile } from '../../types';

interface InputStepProps {
  inputText: string;
  setInputText: (text: string) => void;
  managedFiles: ManagedFile[];
  onFilesChange: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onGenerateOutline: () => void;
  isLoading: boolean;
  loadingMessage: string;
  hasContent: boolean;
}

// Fix: Add types for the non-standard Speech Recognition API to resolve TypeScript errors.
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null;
  onresult: ((event: any) => void) | null;
  start(): void;
  stop(): void;
}

// Define the constructor type for SpeechRecognition
interface SpeechRecognitionStatic {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
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
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
         setInputText(inputText + finalTranscript);
      }
    };
    
    recognition.onend = () => {
        setIsListening(false);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [inputText, setInputText]);
  
  const handleToggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };


  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <label htmlFor="idea-input" className="text-xl font-bold text-slate-200 mb-4">
            Start with your core idea
          </label>
           <div className="relative flex-grow">
              <textarea
                id="idea-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe your presentation topic, key points, and target audience. For example: 'Create a 5-slide presentation on the benefits of remote work for small businesses.'"
                className="w-full h-full min-h-[250px] p-4 pr-12 bg-slate-900/50 border border-slate-600 rounded-lg resize-y focus:ring-2 focus:ring-pink-500 focus:outline-none transition-shadow"
                aria-label="Presentation idea input"
              />
              {recognitionRef.current && (
                 <button
                    onClick={handleToggleListening}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isListening ? 'bg-pink-600 text-white animate-pulse' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                    <MicrophoneIcon className="w-5 h-5" />
                </button>
              )}
           </div>
        </div>
        <div className="flex flex-col">
          <label className="text-xl font-bold text-slate-200 mb-4">
            Or provide files as context
          </label>
          <div className="flex-grow">
            <FileUpload onFilesChange={onFilesChange} />
          </div>
        </div>
      </div>

      {managedFiles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Uploaded Files</h3>
            <ul className="space-y-3">
              {managedFiles.map(mf => (
                <li key={mf.id} className="bg-slate-700/50 p-3 rounded-lg flex items-center justify-between animate-fade-in">
                   <div className="flex-grow pr-4 overflow-hidden">
                        <p className="text-sm text-slate-200 truncate">{mf.file.name}</p>
                        {mf.status === 'loading' && (
                             <div className="w-full bg-slate-600 rounded-full h-1.5 mt-1">
                                <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${mf.progress}%` }}></div>
                            </div>
                        )}
                        {mf.status === 'error' && <p className="text-xs text-red-400 mt-1">Upload failed</p>}
                   </div>
                  <button onClick={() => onRemoveFile(mf.id)} className="text-slate-500 hover:text-red-400 flex-shrink-0">
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

      <div className="mt-8 text-center">
        <button
          onClick={onGenerateOutline}
          disabled={!hasContent || isLoading}
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <Loader />
              <span className="ml-2">{loadingMessage}</span>
            </>
          ) : (
            <>
              <MagicIcon className="w-6 h-6 mr-3" />
              Generate Outline
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputStep;