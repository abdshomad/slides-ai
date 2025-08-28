import React, { useState, useRef, useEffect } from 'react';
import { MagicIcon } from '../../icons';
import ActionMenuContent from './ActionMenuContent';
import { Slide as SlideType } from '../../../types/index';

interface ActionMenuProps {
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


export const ActionMenu: React.FC<ActionMenuProps> = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
              <ActionMenuContent {...props} onItemClick={handleItemClick} />
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
