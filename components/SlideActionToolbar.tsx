import React, { useState, useRef, useEffect } from 'react';
import { Slide } from '../types/index';
import { MagicIcon, EditIcon, StyleIcon, NotesIcon, KeyIcon } from './icons';
import ActionMenuItem from './slide/actions/ActionMenuItem';
import Loader from './Loader';

interface SlideActionToolbarProps {
  slide: Slide;
  onEdit: () => void;
  onStyle: () => void;
  onGenerateTakeaway: () => void;
  onGenerateNotes: () => void;
  showNotes: boolean;
  setShowNotes: (show: boolean) => void;
}

const SlideActionToolbar: React.FC<SlideActionToolbarProps> = (props) => {
    const { slide, onEdit, onStyle, onGenerateTakeaway, onGenerateNotes, showNotes, setShowNotes } = props;
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleItemClick = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                ref={buttonRef}
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="p-1.5 bg-slate-100/50 dark:bg-slate-800/50 text-slate-800 dark:text-white rounded-full hover:bg-pink-600 hover:text-white transition-colors"
                aria-label={`AI actions for slide ${slide.title}`}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <MagicIcon className="w-4 h-4" />
            </button>
            {isOpen && (
                <div
                    className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20 p-2 animate-fade-in-fast"
                    role="menu"
                >
                    <ActionMenuItem onClick={() => handleItemClick(onEdit)}>
                        <EditIcon className="w-4 h-4 mr-3" />Edit Content
                    </ActionMenuItem>
                    <ActionMenuItem onClick={() => handleItemClick(onStyle)}>
                        <StyleIcon className="w-4 h-4 mr-3" />Change Style
                    </ActionMenuItem>

                    <hr className="my-1 border-slate-200 dark:border-slate-600" />
                    
                    {slide.speakerNotes ? (
                        <ActionMenuItem onClick={() => handleItemClick(() => setShowNotes(!showNotes))}>
                            <NotesIcon className="w-4 h-4 mr-3" />{showNotes ? 'Hide Notes' : 'Show Notes'}
                        </ActionMenuItem>
                    ) : (
                        <ActionMenuItem onClick={() => handleItemClick(onGenerateNotes)} disabled={slide.isGeneratingNotes}>
                            {slide.isGeneratingNotes ? <Loader /> : <NotesIcon className="w-4 h-4 mr-3" />}
                            {slide.isGeneratingNotes ? 'Generating...' : 'Generate Notes'}
                        </ActionMenuItem>
                    )}
                    
                    {!slide.keyTakeaway && (
                        <ActionMenuItem onClick={() => handleItemClick(onGenerateTakeaway)} disabled={slide.isGeneratingTakeaway}>
                            {slide.isGeneratingTakeaway ? <Loader /> : <KeyIcon className="w-4 h-4 mr-3" />}
                            {slide.isGeneratingTakeaway ? 'Generating...' : 'Key Takeaway'}
                        </ActionMenuItem>
                    )}
                </div>
            )}
        </div>
    );
};

export default SlideActionToolbar;