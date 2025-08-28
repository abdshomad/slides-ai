import React from 'react';

interface OutlineEditorProps {
  outline: string;
  setOutline: (outline: string) => void;
}

const OutlineEditor: React.FC<OutlineEditorProps> = ({ outline, setOutline }) => {
  return (
    <div>
      <label htmlFor="outline-editor" className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Editable Outline</label>
      <textarea
        id="outline-editor"
        value={outline}
        onChange={(e) => setOutline(e.target.value)}
        className="w-full h-96 p-4 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg resize-y focus:ring-2 focus:ring-pink-500 focus:outline-none transition-shadow custom-scrollbar"
        placeholder="Your presentation outline will appear here..."
      />
    </div>
  );
};

export default OutlineEditor;