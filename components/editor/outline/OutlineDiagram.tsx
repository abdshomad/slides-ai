import React, { useEffect, useMemo, useState } from 'react';
import { ParsedSlide } from '../../../utils/outlineParser';

declare const mermaid: any;

interface OutlineDiagramProps {
    parsedOutline: ParsedSlide[];
}

const themes = [
  { id: 'neutral', name: 'Neutral' },
  { id: 'dark', name: 'Dark' },
  { id: 'forest', name: 'Forest' },
  { id: 'default', name: 'Default' },
];


const OutlineDiagram: React.FC<OutlineDiagramProps> = ({ parsedOutline }) => {
    const isAppInDarkMode = useMemo(() => document.documentElement.classList.contains('dark'), []);
    const [selectedTheme, setSelectedTheme] = useState(isAppInDarkMode ? 'dark' : 'neutral');

    const mermaidString = useMemo(() => {
        if (parsedOutline.length === 0) {
            return '';
        }
        let graph = 'graph TD\n';
        parsedOutline.forEach((slide, index) => {
            // Sanitize title for mermaid ID and label
            const nodeId = `slide${index}`;
            const titleText = slide.title.replace(/"/g, '#quot;').replace(/</g, '#lt;').replace(/>/g, '#gt;');
            const label = `"${index + 1}. ${titleText}"`;
            graph += `    ${nodeId}(${label})\n`;

            if (index > 0) {
                const prevNodeId = `slide${index - 1}`;
                graph += `    ${prevNodeId} --> ${nodeId}\n`;
            }
        });
        return graph;
    }, [parsedOutline]);
    
    useEffect(() => {
        if (mermaidString) {
            const container = document.getElementById('outline-diagram-container');
            if(container) {
                // Clear previous render and inject new mermaid code
                container.innerHTML = `<div class="mermaid" style="width: 100%; height: 100%;">${mermaidString}</div>`;
                // Initialize and run Mermaid with the selected theme
                mermaid.initialize({ startOnLoad: false, theme: selectedTheme });
                mermaid.run({ nodes: container.querySelectorAll('.mermaid') });
            }
        }
    }, [mermaidString, selectedTheme]);

    return (
        <div className="relative h-96 overflow-auto pr-2 custom-scrollbar bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-center justify-center">
            <div className="absolute top-3 right-3 z-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-md p-1 flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mr-1 pl-1">Theme:</span>
                {themes.map(theme => (
                    <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                            selectedTheme === theme.id 
                            ? 'bg-pink-600 text-white shadow-sm' 
                            : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        aria-pressed={selectedTheme === theme.id}
                        title={`Set ${theme.name} theme`}
                    >
                        {theme.name}
                    </button>
                ))}
            </div>

            {parsedOutline.length > 0 ? (
                <div id="outline-diagram-container" className="w-full h-full" />
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                    <p>Your generated outline diagram will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default OutlineDiagram;