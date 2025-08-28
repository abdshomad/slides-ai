import React from 'react';
import { Slide } from '../../types/index';
import ImageSearchResults from '../slide/ImageSearchResults';

interface SearchTabProps {
    slide: Slide;
    onSelectFromSearch: (slideId: string, url: string) => void;
    onClose: () => void;
}

const SearchTab: React.FC<SearchTabProps> = ({ slide, onSelectFromSearch, onClose }) => {
    
    const handleSelectFromSearch = (url: string) => {
        onSelectFromSearch(slide.id, url);
        onClose();
    };

    if (!slide.imageSearchResults?.length) {
        return <div className="text-center py-10"><p className="text-slate-500">No relevant web images were found for this slide.</p></div>;
    }

    return (
        <div>
            <h3 className="text-lg font-semibold mb-3">From the Web</h3>
            <div className="h-48">
                <ImageSearchResults results={slide.imageSearchResults} onSelect={handleSelectFromSearch} />
            </div>
        </div>
    );
};

export default SearchTab;