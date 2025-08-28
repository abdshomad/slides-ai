import React, { useEffect, useMemo } from 'react';
import { ParsedSlide } from '../../../utils/outlineParser';

declare const mermaid: any;

interface OutlineDiagramProps {
    parsedOutline: ParsedSlide[];
}

const OutlineDiagram: React.FC<OutlineDiagramProps> = ({ parsedOutline }) => {

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
                // Initialize and run Mermaid
                const isDark = document.documentElement.classList.contains('dark');
                mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'neutral' });
                mermaid.run({ nodes: container.querySelectorAll('.mermaid') });
            }
        }
    }, [mermaidString]);

    return (
        <div className="h-96 overflow-auto pr-2 custom-scrollbar bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-center justify-center">
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