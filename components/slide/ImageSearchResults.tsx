import React from 'react';

interface ImageSearchResult {
    url: string;
    title: string;
}

interface ImageSearchResultsProps {
    results: ImageSearchResult[];
    onSelect: (url: string) => void;
}

const ImageSearchResultCard: React.FC<{ result: ImageSearchResult; onSelect: () => void }> = ({ result, onSelect }) => {
    return (
        <button
            onClick={onSelect}
            className="w-28 h-full flex-shrink-0 bg-slate-300 dark:bg-slate-700 rounded-md overflow-hidden group relative transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30"
            aria-label={`Select image: ${result.title}`}
        >
            <img src={result.url} alt={result.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300"></div>
            <p className="absolute bottom-1 left-2 right-2 text-white text-xs font-semibold truncate" title={result.title}>
                {result.title}
            </p>
        </button>
    );
};


const ImageSearchResults: React.FC<ImageSearchResultsProps> = ({ results, onSelect }) => {
    if (!results || results.length === 0) return null;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-200/50 dark:bg-slate-800/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 flex-shrink-0">Choose an Image</h4>
            <div className="flex-grow w-full flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {results.slice(0, 3).map((result) => (
                    <ImageSearchResultCard
                        key={result.url}
                        result={result}
                        onSelect={() => onSelect(result.url)}
                    />
                ))}
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                  height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: #94a3b8;
                  border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #475569;
                }
            `}</style>
        </div>
    );
};

export default ImageSearchResults;