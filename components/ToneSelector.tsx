import React from 'react';
import { BriefcaseIcon, CoffeeIcon, SparklesIcon, ScissorsIcon, LightbulbIcon } from './icons';

interface ToneSelectorProps {
  selectedTone: string;
  onToneChange: (tone: string) => void;
}

const tones = [
    { name: 'Professional', icon: BriefcaseIcon, description: 'Formal, structured, and authoritative.' },
    { name: 'Casual', icon: CoffeeIcon, description: 'Relaxed, friendly, and conversational.' },
    { name: 'Enthusiastic', icon: SparklesIcon, description: 'Upbeat, energetic, and passionate.' },
    { name: 'Concise', icon: ScissorsIcon, description: 'To-the-point, clear, and direct.' },
    { name: 'Creative', icon: LightbulbIcon, description: 'Imaginative, witty, and original.' },
];

const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onToneChange }) => {
  return (
    <div className="mt-8 animate-fade-in">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Choose a Content Tone</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {tones.map(({ name, icon: Icon, description }) => {
            const isSelected = selectedTone === name;
            return (
                <button
                    key={name}
                    onClick={() => onToneChange(name)}
                    className={`p-4 border-2 rounded-lg text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center h-32 transform hover:-translate-y-1
                        ${isSelected ? 'border-pink-500 bg-slate-100 dark:bg-slate-700/50 shadow-lg shadow-pink-500/20' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800'}
                    `}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={name}
                >
                    <Icon className={`w-8 h-8 mb-2 transition-colors ${isSelected ? 'text-pink-500 dark:text-pink-400' : 'text-slate-500 dark:text-slate-400'}`} />
                    <h4 className={`font-bold text-sm ${isSelected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>{name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
                </button>
            )
        })}
      </div>
    </div>
  );
};

export default ToneSelector;
