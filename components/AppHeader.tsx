import React, { useState } from 'react';
import { BookOpenIcon, QuestionMarkCircleIcon } from './icons';
import ThemeSwitcher from './ThemeSwitcher';
// FIX: Corrected import path for View and Theme types.
import { View, Theme } from '../types/index';

interface AppHeaderProps {
    onStartTour: () => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    setActiveView: (view: View) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onStartTour, theme, setTheme, setActiveView }) => {
    const [isDocsMenuOpen, setIsDocsMenuOpen] = useState(false);
    
    return (
        <header className="text-center mb-8 flex justify-between items-center relative">
           <div className="flex-1"></div> {/* Spacer */}
           <div className="flex-grow">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--special-gradient-from)] to-[var(--accent-DEFAULT)]">
                AI Presentation Designer
              </h1>
              <p className="mt-4 text-lg text-[var(--text-secondary)]">
                From raw ideas to polished slides with AI-powered research and design.
              </p>
           </div>
           <div className="flex-1 flex justify-end items-center gap-4">
            <button
                onClick={onStartTour}
                className="flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--background-interactive)]/60 hover:bg-[var(--background-interactive-hover)]/80 px-3 py-1.5 rounded-md transition-colors border border-[var(--border-secondary)]/50"
                aria-label="Start guided tour"
              >
              <QuestionMarkCircleIcon className="w-4 h-4 mr-2" />
              <span>Tour</span>
            </button>
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
             <div className="relative">
                <button
                  onClick={() => setIsDocsMenuOpen(!isDocsMenuOpen)}
                  onBlur={() => setTimeout(() => setIsDocsMenuOpen(false), 200)}
                  className="flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--background-interactive)]/60 hover:bg-[var(--background-interactive-hover)]/80 px-3 py-1.5 rounded-md transition-colors border border-[var(--border-secondary)]/50"
                  aria-haspopup="true"
                  aria-expanded={isDocsMenuOpen}
                >
                    <BookOpenIcon className="w-4 h-4 mr-2" />
                    <span>Documentation</span>
                     <svg className={`w-4 h-4 ml-1 transition-transform ${isDocsMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                 {isDocsMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[var(--background-muted)] border border-[var(--border-primary)] rounded-md shadow-lg z-10 animate-fade-in-fast">
                        <button
                          onClick={() => { setActiveView('prd'); setIsDocsMenuOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--background-subtle)] hover:text-[var(--accent)]"
                        >
                          View PRD
                        </button>
                        <button
                          onClick={() => { setActiveView('sample'); setIsDocsMenuOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--background-subtle)] hover:text-[var(--accent)]"
                        >
                          Sample Presentation
                        </button>
                    </div>
                )}
             </div>
           </div>
        </header>
    );
};

export default AppHeader;