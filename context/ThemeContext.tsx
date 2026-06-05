'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  targetTheme: Theme | null;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetTheme, setTargetTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tute-theme') as Theme | null;
    const isDark = saved === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // Add transitioning class to enable smooth CSS transitions globally
    document.documentElement.classList.add('theme-transitioning');
    
    const next = theme === 'light' ? 'dark' : 'light';
    setTargetTheme(next);

    // Swap document class at peak light shift (500ms)
    setTimeout(() => {
      setTheme(next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('tute-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('tute-theme', 'light');
      }
    }, 500);

    // Complete transition and slide the lamp back up (1200ms)
    setTimeout(() => {
      setIsTransitioning(false);
      setTargetTheme(null);
      // Remove transitioning class to avoid interference with normal hovers
      document.documentElement.classList.remove('theme-transitioning');
    }, 1200);
  };

  return (
    <ThemeContext.Provider value={{ theme, targetTheme, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
