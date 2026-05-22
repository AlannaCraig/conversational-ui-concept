/**
 * Theme Hook
 *
 * Manages theme switching and applies CSS variables
 */

'use client';

import { useState, useEffect } from 'react';
import { convertFigmaThemeToCSSVars, applyCSSVars, getThemeName } from '@/lib/themeConverter';

// Theme file names (without .tokens.json extension)
const THEMES = [
  'Midnight',
  'Glacier',
  'Ivory',
  'Cool granite',
  'Warm earth',
];

export function useTheme() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentThemeName, setCurrentThemeName] = useState('Midnight');
  const [isLoading, setIsLoading] = useState(false);

  // Load and apply theme
  const loadTheme = async (themeName: string) => {
    setIsLoading(true);
    try {
      // Import the theme JSON
      const themeModule = await import(`@/tokens/themes/${themeName}.tokens.json`);
      const figmaTheme = themeModule.default;

      // Convert to CSS vars and apply
      const cssVars = convertFigmaThemeToCSSVars(figmaTheme);
      applyCSSVars(cssVars);

      // Update theme name
      const name = getThemeName(figmaTheme);
      setCurrentThemeName(name);

      // Save preference to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', themeName);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize theme from localStorage or default
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && THEMES.includes(savedTheme)) {
        const index = THEMES.indexOf(savedTheme);
        setCurrentThemeIndex(index);
        loadTheme(savedTheme);
      } else {
        // Load default theme (Midnight)
        loadTheme(THEMES[0]);
      }
    }
  }, []);

  // Cycle to next theme
  const cycleTheme = () => {
    const nextIndex = (currentThemeIndex + 1) % THEMES.length;
    setCurrentThemeIndex(nextIndex);
    loadTheme(THEMES[nextIndex]);
  };

  return {
    currentTheme: THEMES[currentThemeIndex],
    currentThemeName,
    cycleTheme,
    isLoading,
    themes: THEMES,
  };
}
