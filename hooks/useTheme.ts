import { useState, useEffect } from 'react';
// FIX: Correct import path for Theme type
import { Theme } from '../types/index';
import { appColors } from '../theme/colors';

// Helper function to create CSS variables from the theme object
const createCssVariables = (colors: typeof appColors) => {
  let lightVars = ':root {\n';
  let darkVars = 'html.dark {\n';

  // FIX: Changed `category: object` to `Record<string, any>` to resolve type inference issues
  // that caused 'value' to be inferred as 'never' in some branches, leading to compile errors.
  const processCategory = (categoryName: string, category: Record<string, any>) => {
    for (const key in category) {
      if (Object.prototype.hasOwnProperty.call(category, key)) {
        const value = category[key];
        // CSS variable names are simplified (e.g., --background-base)
        const varName = `--${categoryName}-${key.toLowerCase()}`;
        
        if (typeof value === 'object' && value !== null && 'light' in value && 'dark' in value) {
            lightVars += `  ${varName}: ${value.light};\n`;
            darkVars += `  ${varName}: ${value.dark};\n`;
        } else if (typeof value === 'object' && value !== null) {
            for (const subKey in value) {
              if (Object.prototype.hasOwnProperty.call(value, subKey)) {
                const subValue = value[subKey];
                // FIX: Lowercase the sub-key for consistent CSS variable naming (e.g., --special-gradient-from).
                const subVarName = `${varName}-${String(subKey).toLowerCase()}`;
                lightVars += `  ${subVarName}: ${subValue};\n`;
                darkVars += `  ${subVarName}: ${subValue};\n`;
              }
            }
        }
      }
    }
  };

  for (const categoryName in colors) {
    if (Object.prototype.hasOwnProperty.call(colors, categoryName)) {
        processCategory(categoryName, colors[categoryName as keyof typeof colors]);
    }
  }
  
  // Create a simple --accent var for use in pseudo-elements where var(--accent-default) might not work
  lightVars += `  --accent: ${colors.accent.DEFAULT.light};\n`;
  darkVars += `  --accent: ${colors.accent.DEFAULT.dark};\n`;
  
  lightVars += '}';
  darkVars += '}';
  return `${lightVars}\n${darkVars}`;
};


const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'system'
  );

  useEffect(() => {
    // Inject the CSS variables into the head
    const styleId = 'app-theme-variables';
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = createCssVariables(appColors);
    
    // Manage the theme class on the html element
    localStorage.setItem('theme', theme);

    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
        if (theme === 'system') {
            const systemIsDark = mediaQuery.matches;
            root.classList.toggle('dark', systemIsDark);
        } else {
            root.classList.toggle('dark', theme === 'dark');
        }
    };
    
    const handleChange = () => {
      // The `theme` variable is from the effect's closure.
      // Since the effect re-runs on theme change, this listener
      // will correctly do nothing if the theme is not 'system'.
      if (theme === 'system') {
        applyTheme();
      }
    };

    applyTheme();

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);


  return { theme, setTheme };
};

export default useTheme;
