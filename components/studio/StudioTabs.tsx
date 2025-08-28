import React from 'react';
import { Slide } from '../../types/index';
import { Tab } from '../ImageStudioModal';
import { MagicIcon, EditIcon, ImageIcon, ResearchIcon } from '../icons';

interface StudioTabsProps {
    slide: Slide;
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center gap-2 ${active ? 'bg-pink-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        role="tab"
        aria-selected={active}
    >
        {children}
    </button>
);

const StudioTabs: React.FC<StudioTabsProps> = ({ slide, activeTab, setActiveTab }) => {
    return (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-2">
                <TabButton active={activeTab === 'generate'} onClick={() => setActiveTab('generate')}><MagicIcon className="w-4 h-4" />Generate</TabButton>
                {slide.image && <TabButton active={activeTab === 'edit'} onClick={() => setActiveTab('edit')}><EditIcon className="w-4 h-4" />Edit</TabButton>}
                <TabButton active={activeTab === 'suggestions'} onClick={() => setActiveTab('suggestions')}><ImageIcon className="w-4 h-4" />Suggestions</TabButton>
                <TabButton active={activeTab === 'search'} onClick={() => setActiveTab('search')}><ResearchIcon className="w-4 h-4" />Search</TabButton>
            </div>
        </div>
    );
};

export default StudioTabs;