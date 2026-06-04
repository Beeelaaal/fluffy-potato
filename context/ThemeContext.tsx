'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isTransitioning, setIsTransitioning] = useState(false);

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

    // Swap document class at peak shutter occlusion (450ms)
    setTimeout(() => {
      setTheme((prev) => {
        const next = prev === 'light' ? 'dark' : 'light';
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
          localStorage.setItem('tute-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('tute-theme', 'light');
        }
        return next;
      });
    }, 450);

    // Complete transition and slide shutters open
    setTimeout(() => {
      setIsTransitioning(false);
    }, 900);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
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
