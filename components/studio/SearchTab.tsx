import React, { useState } from 'react';
import { Slide } from '../../types/index';
import ImageSearchResults from '../slide/ImageSearchResults';
import { searchStockImages } from '../../services/stockImageService';
import { StockImageResult } from '../../types/api';
import Loader from '../Loader';
import { ResearchIcon, ImageIcon } from '../icons';

interface SearchTabProps {
    slide: Slide;
    onSelectFromSearch: (slideId: string, url: string) => void;
    onClose: () => void;
}

const SearchTab: React.FC<SearchTabProps> = ({ slide, onSelectFromSearch, onClose }) => {
    const hasAiResults = slide.imageSearchResults && slide.imageSearchResults.length > 0;
    const [searchSource, setSearchSource] = useState<'ai' | 'stock'>('ai');
    
    const [query, setQuery] = useState(slide.title);
    const [stockResults, setStockResults] = useState<StockImageResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSelect = (url: string) => {
        onSelectFromSearch(slide.id, url);
        onClose();
    };
    
    const handleStockSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;
        
        setIsLoading(true);
        setSearched(true);
        const searchResults = await searchStockImages(query);
        setStockResults(searchResults);
        setIsLoading(false);
    };

    const renderStockSearch = () => (
        <>
            <form onSubmit={handleStockSearch} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., business, nature, technology"
                    className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-pink-500"
                />
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-slate-500" disabled={!query.trim() || isLoading}>
                    <ResearchIcon className="w-5 h-5" />
                </button>
            </form>
            {isLoading && <div className="h-48 flex items-center justify-center"><Loader /></div>}
            {!isLoading && searched && stockResults.length === 0 && <div className="h-48 flex items-center justify-center"><p className="text-slate-500">No results found for "{query}".</p></div>}
            {!isLoading && stockResults.length > 0 && (
                 <div className="grid grid-cols-3 gap-3 h-48 overflow-y-auto custom-scrollbar pr-2">
                    {stockResults.map(result => (
                        <button
                            key={result.id}
                            onClick={() => handleSelect(result.url)}
                            className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden group relative transition-transform transform hover:scale-105"
                            aria-label={`Select image: ${result.description}`}
                        >
                            <img src={result.thumbUrl} alt={result.description || ''} className="w-full h-full object-cover" loading="lazy" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                                <p className="text-xs text-white">by {result.user.name}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
            {!isLoading && !searched && (
                 <div className="h-48 flex items-center justify-center">
                    <button onClick={() => handleStockSearch()} className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">
                        Search for "{query}"
                    </button>
                 </div>
            )}
             <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
            `}</style>
        </>
    );

    const renderAiSearch = () => {
        if (hasAiResults) {
            return (
                <div className="h-64">
                    <ImageSearchResults results={slide.imageSearchResults || []} onSelect={handleSelect} />
                </div>
            );
        }

        return (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
                <h4 className="font-semibold text-slate-700 dark:text-slate-300">No AI Search Results</h4>
                <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm max-w-xs">
                    The AI didn't find any web images for this slide during its initial research.
                </p>
                <button
                    onClick={() => {
                        setSearchSource('stock');
                        // Use a short timeout to ensure the UI switches to the stock search tab
                        // before the loading state appears. This feels smoother.
                        setTimeout(() => handleStockSearch(), 50);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                    <ResearchIcon className="w-5 h-5 mr-2" />
                    Search Stock Photos for "{query}"
                </button>
            </div>
        );
    };
    
    return (
        <div>
            <div className="flex justify-center mb-4">
                <div className="inline-flex gap-1 p-1 bg-slate-200 dark:bg-slate-700/50 rounded-md">
                    <button onClick={() => setSearchSource('ai')} className={`px-3 py-1 text-sm rounded ${searchSource === 'ai' ? 'bg-white dark:bg-slate-600' : 'hover:bg-slate-300/50 dark:hover:bg-slate-700'}`}>AI Search</button>
                    <button onClick={() => setSearchSource('stock')} className={`px-3 py-1 text-sm rounded ${searchSource === 'stock' ? 'bg-white dark:bg-slate-600' : 'hover:bg-slate-300/50 dark:hover:bg-slate-700'}`}>Stock Photos</button>
                </div>
            </div>
            {searchSource === 'ai' ? renderAiSearch() : renderStockSearch()}
        </div>
    );
};

export default SearchTab;