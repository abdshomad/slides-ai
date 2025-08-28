import React, { useState, useRef, useEffect } from 'react';
// FIX: Correct import path for types
import { Slide as SlideType } from '../types/index';
import {
  EditIcon, StyleIcon, KeyIcon, NotesIcon, HistoryIcon, ExpandIcon, MagicIcon, FactCheckIcon, LightbulbIcon, UsersIcon
} from './icons';
import Loader from './Loader';

// Props interface remains the same
interface SlideActionToolbarProps {
  slide: SlideType;
  onEdit: () => void;
  onStyle: () => void;
  onGenerateTakeaway: () => void;
  onGenerateNotes: () => void;
  onExpand: () => void;
  onViewHistory: () => void;
  onGenerateImage: () => void;
  onFactCheck: () => void;
  onCritiqueDesign: () => void;
  onAdaptAudience: () => void;
  showNotes: boolean;
  setShowNotes: (show: boolean) => void;
}

// Reusable menu item component
const MenuItem: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled = false, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-wait disabled:hover:bg-transparent dark:disabled:hover:bg-transparent transition-colors rounded-md"
    role="menuitem"
  >
    {children}
  </button>
);

const SlideActionToolbar: React.FC<SlideActionToolbarProps> = ({
  slide,
  onEdit,
  onStyle,
  onGenerateTakeaway,
  onGenerateNotes,
  onExpand,
  onViewHistory,
  onGenerateImage,
  onFactCheck,
  onCritiqueDesign,
  onAdaptAudience,
  showNotes,
  setShowNotes,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // This popover-closing logic should only apply to larger screens.
      // On mobile, the backdrop handles closing.
      if (window.innerWidth < 640) return;

      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleItemClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };
  
  return (
    <div data-tour-id="ai-editing-tools" className="flex-shrink-0 p-4 bg-slate-200/50 dark:bg-slate-800/50 rounded-b-lg border-t border-slate-300/50 dark:border-slate-600/50 flex justify-center items-center">
      <div className="sm:relative">
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 transition-all"
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
        >
          <MagicIcon className="w-5 h-5 mr-2" />
          AI Tools & Actions
        </button>

        {isMenuOpen && (
          <>
            {/* Backdrop for mobile bottom sheet */}
            <div 
              className="fixed inset-0 bg-black/60 z-10 sm:hidden animate-fade-in-fast"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            
            <div
              ref={menuRef}
              className="
                fixed bottom-0 left-0 right-0 w-full max-h-[75vh] overflow-y-auto
                bg-white dark:bg-slate-700
                border-t border-slate-200 dark:border-slate-600
                rounded-t-xl shadow-2xl z-20 p-2
                animate-slide-up-fast

                sm:absolute sm:bottom-full sm:left-1/2 sm:-translate-x-1/2 sm:w-64 sm:max-h-none sm:overflow-y-visible
                sm:border sm:rounded-lg
                sm:animate-fade-in-fast sm:origin-bottom sm:mb-2
              "
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              {/* Mobile-only handle and title */}
              <div className="sm:hidden w-12 h-1.5 bg-slate-300 dark:bg-slate-500 rounded-full mx-auto my-2" />
              <h3 className="sm:hidden text-lg font-bold text-center mb-2 text-slate-800 dark:text-slate-200">AI Tools & Actions</h3>
              
              {/* Group 1: Core Editing */}
              <MenuItem onClick={() => handleItemClick(onEdit)}><EditIcon className="w-4 h-4 mr-3" />Edit Content</MenuItem>
              <MenuItem onClick={() => handleItemClick(onStyle)}><StyleIcon className="w-4 h-4 mr-3" />Change Style</MenuItem>

              <hr className="my-2 border-slate-200 dark:border-slate-600" />
              
              {/* Group 2: AI Content Generation */}
              {slide.speakerNotes ? (
                <MenuItem onClick={() => handleItemClick(() => setShowNotes(!showNotes))}>
                  <NotesIcon className="w-4 h-4 mr-3" />{showNotes ? 'Hide Notes' : 'Show Notes'}
                </MenuItem>
              ) : (
                <MenuItem onClick={() => handleItemClick(onGenerateNotes)} disabled={slide.isGeneratingNotes}>
                  {slide.isGeneratingNotes ? <Loader /> : <NotesIcon className="w-4 h-4 mr-3" />}
                  {slide.isGeneratingNotes ? 'Generating...' : 'Generate Notes'}
                </MenuItem>
              )}
              
              {!slide.keyTakeaway && (
                <MenuItem onClick={() => handleItemClick(onGenerateTakeaway)} disabled={slide.isGeneratingTakeaway}>
                  {slide.isGeneratingTakeaway ? <Loader /> : <KeyIcon className="w-4 h-4 mr-3" />}
                  {slide.isGeneratingTakeaway ? 'Generating...' : 'Key Takeaway'}
                </MenuItem>
              )}

              {slide.imagePrompt && (
                <MenuItem onClick={() => handleItemClick(onGenerateImage)} disabled={slide.isLoadingImage}>
                  {slide.isLoadingImage ? <Loader /> : <MagicIcon className="w-4 h-4 mr-3" />}
                  {slide.isLoadingImage ? 'Generating...' : `${slide.image ? 'Regenerate' : 'Generate'} Image`}
                </MenuItem>
              )}
              
              <MenuItem onClick={() => handleItemClick(onAdaptAudience)} disabled={slide.isAdaptingAudience}>
                {slide.isAdaptingAudience ? <Loader /> : <UsersIcon className="w-4 h-4 mr-3" />}
                {slide.isAdaptingAudience ? 'Adapting...' : 'Adapt Audience'}
              </MenuItem>
              
              <MenuItem onClick={() => handleItemClick(onExpand)} disabled={slide.isExpanding}>
                {slide.isExpanding ? <Loader /> : <ExpandIcon className="w-4 h-4 mr-3" />}
                {slide.isExpanding ? 'Expanding...' : 'Expand Slide'}
              </MenuItem>

              <hr className="my-2 border-slate-200 dark:border-slate-600" />

              {/* Group 3: AI Analysis */}
              <MenuItem onClick={() => handleItemClick(onFactCheck)} disabled={slide.isFactChecking}>
                {slide.isFactChecking ? <Loader /> : <FactCheckIcon className="w-4 h-4 mr-3" />}
                {slide.isFactChecking ? 'Checking...' : 'Fact Check'}
              </MenuItem>
              
              <MenuItem onClick={() => handleItemClick(onCritiqueDesign)} disabled={slide.isCritiquing}>
                {slide.isCritiquing ? <Loader /> : <LightbulbIcon className="w-4 h-4 mr-3" />}
                {slide.isCritiquing ? 'Analyzing...' : 'Suggest Ideas'}
              </MenuItem>
              
              <hr className="my-2 border-slate-200 dark:border-slate-600" />
              
              {/* Group 4: Utilities */}
              <MenuItem onClick={() => handleItemClick(onViewHistory)}><HistoryIcon className="w-4 h-4 mr-3" />View History</MenuItem>

            </div>
          </>
        )}
      </div>
       <style>{`
        .animate-fade-in-fast {
          animation: fadeIn 0.15s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up-fast {
          animation: slideUp 0.2s cubic-bezier(0.32, 0.72, 0, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SlideActionToolbar;
