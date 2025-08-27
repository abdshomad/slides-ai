import React from 'react';

interface ToneSelectorProps {
  selectedTone: string;
  onToneChange: (tone: string) => void;
}

const tones = ['Professional', 'Casual', 'Enthusiastic', 'Concise', 'Creative'];

const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onToneChange }) => {
  return (
    <div className="mt-8 animate-fade-in">
      <h3 className="text-xl font-bold text-slate-200 mb-4">Choose a Content Tone</h3>
      <div className="relative">
        <select
          value={selectedTone}
          onChange={(e) => onToneChange(e.target.value)}
          className="w-full appearance-none bg-slate-700 border border-slate-600 text-white py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-slate-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
          aria-label="Select content tone"
        >
          {tones.map(tone => (
            <option key={tone} value={tone}>{tone}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default ToneSelector;
