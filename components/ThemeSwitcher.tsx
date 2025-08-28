

import React, { useState, useEffect, useRef } from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { DesktopIcon } from './icons/DesktopIcon';
// FIX: Correct import path for Theme type
import { Theme } from '../types/index';


interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        { value: 'light', label: 'Light', icon: SunIcon },
        { value: 'dark', label: 'Dark', icon: MoonIcon },
        { value: 'system', label: 'System', icon: DesktopIcon },
    ] as const;

    const CurrentIcon = options.find(opt => opt.value === theme)?.icon || DesktopIcon;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (selectedTheme: Theme) => {
        setTheme(selectedTheme);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-800/60 hover:bg-slate-300 dark:hover:bg-slate-700/80 transition-colors border border-slate-300 dark:border-slate-700/50"
                aria-label={`Current theme: ${theme}. Change theme.`}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <CurrentIcon className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-10 animate-fade-in-fast">
                    <ul className="py-1">
                        {options.map((option) => (
                            <li key={option.value}>
                                <button
                                    onClick={() => handleSelect(option.value)}
                                    className={`w-full text-left flex items-center px-3 py-2 text-sm ${
                                        theme === option.value
                                            ? 'bg-slate-100 dark:bg-slate-700 text-pink-500 dark:text-pink-400'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <option.icon className="w-4 h-4 mr-3" />
                                    {option.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;