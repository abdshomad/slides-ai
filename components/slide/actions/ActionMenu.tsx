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
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // This effect is for the desktop popover click-outside behavior.
      // Mobile modal handles this with a backdrop click.
      if (
        desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node) &&
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
            {/* Mobile: A centered modal dialog. */}
            <div 
              className="fixed inset-0 bg-black/60 z-20 p-4 flex items-center justify-center sm:hidden animate-fade-in-fast"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            >
              <div 
                className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-h-[85vh] overflow-y-auto animate-modal-enter"
                onClick={(e) => e.stopPropagation()}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
              >
                <ActionMenuContent {...props} onItemClick={handleItemClick} />
              </div>
            </div>

            {/* Desktop: A popover menu. */}
            <div
              ref={desktopMenuRef}
              className="
                hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 w-64 mb-2 z-20 
              "
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
               <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-2xl p-2 animate-fade-in-fast">
                 <ActionMenuContent {...props} onItemClick={handleItemClick} />
               </div>
            </div>
          </>
        )}
      </div>
       <style>{`
        .animate-fade-in-fast {
          animation: fadeIn 0.15s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-modal-enter {
          animation: modalEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalEnter {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (min-width: 640px) {
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(5px) scale(0.98); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
        }
      `}</style>
    </div>
  );
};