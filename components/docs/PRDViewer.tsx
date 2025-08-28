import React, { useMemo, useEffect, useState } from 'react';
import { ArrowLeftIcon } from '../icons';

declare const mermaid: any;

const fileOrder = [
    '01_introduction.md',
    '02_goals.md',
    '03_user_personas.md',
    '04_functional_requirements.md',
    'functional_requirements/01_project_management.md',
    'functional_requirements/02_input_and_context.md',
    'functional_requirements/03_outline_generation.md',
    'functional_requirements/04_slide_generation_and_editing.md',
    'functional_requirements/05_version_history.md',
    'functional_requirements/06_exporting.md',
    '05_non_functional_requirements.md',
    '06_future_scope.md',
    '07_enhancements.md',
];

const SimpleMarkdownParser: React.FC<{ content: string }> = ({ content }) => {
    // A simplified parser. In a real app, use a library like 'marked' or 'react-markdown'.
    const html = useMemo(() => {
        let processedHtml = content;
        // Process mermaid blocks first
        processedHtml = processedHtml.replace(/```mermaid([\s\S]*?)```/g, (match, p1) => {
            return `<div class="mermaid">${p1.trim()}</div>`;
        });
        
        // Process other markdown elements
        processedHtml = processedHtml
          .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-pink-600 dark:text-pink-400">$1</h1>')
          .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 text-slate-800 dark:text-slate-200">$1</h2>')
          .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-4 mb-2 text-slate-700 dark:text-slate-300">$1</h3>')
          .replace(/^\* (.*$)/gim, '<li>$1</li>')
          .replace(/^(<li>[\s\S]*?<\/li>)/gim, '<ul>$1</ul>')
          .replace(/<\/ul>\n?<ul>/gim, '')
          .replace(/`([^`]+)`/g, '<code class="bg-slate-200 dark:bg-slate-700 text-pink-600 dark:text-pink-300 px-1 py-0.5 rounded text-sm">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-pink-500 dark:text-pink-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
          .replace(/\n/g, '<br />')
          .replace(/<br \/><br \/>/g, '<br />');

        return processedHtml;

    }, [content]);

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};


const PRDViewer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [content, setContent] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const fetchPromises = fileOrder.map(file =>
                    fetch(`../../prd/${file}`).then(res => {
                        if (!res.ok) throw new Error(`Failed to fetch ${file}`);
                        return res.text();
                    })
                );
                const allContent = await Promise.all(fetchPromises);
                setContent(allContent);
            } catch (err) {
                console.error("Error loading PRD files:", err);
                setError(err instanceof Error ? err.message : "Could not load documentation.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

    useEffect(() => {
        if (!isLoading && content.length > 0) {
            const isDark = document.documentElement.classList.contains('dark');
            mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'neutral' });
            // Defer mermaid run to allow DOM to update
            setTimeout(() => {
                 const mermaidElements = document.querySelectorAll('.mermaid');
                if (mermaidElements.length > 0) {
                    mermaid.run({ nodes: mermaidElements });
                }
            }, 100);
        }
    }, [isLoading, content]);

    const renderBody = () => {
        if (isLoading) {
            return <p className="text-center text-slate-500 dark:text-slate-400">Loading documentation...</p>;
        }
        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }
        return (
            <article className="prose dark:prose-invert bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6 sm:p-8 flex-grow max-w-4xl mx-auto">
                {content.map((fileContent, index) => (
                    <React.Fragment key={fileOrder[index]}>
                        <SimpleMarkdownParser content={fileContent} />
                        {index < content.length - 1 && <hr className="my-8 border-slate-300 dark:border-slate-700" />}
                    </React.Fragment>
                ))}
            </article>
        );
    };
    
    return (
        <div className="animate-fade-in">
             <button onClick={onBack} className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-800/60 hover:bg-slate-300 dark:hover:bg-slate-700/80 px-3 py-1.5 rounded-md transition-colors border border-slate-300 dark:border-slate-700/50 mb-6">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to App
            </button>
            {renderBody()}
             <style>{`
                .prose strong { @apply text-slate-800 dark:text-slate-200; }
                .prose ul > li::before { background-color: #DB2777; }
             `}</style>
        </div>
    );
};

export default PRDViewer;