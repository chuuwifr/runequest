import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeId, THEMES, ThemeConfig } from '../types/theme';

interface ThemeContextType {
  currentThemeId: ThemeId;
  currentTheme: ThemeConfig;
  setTheme: (themeId: ThemeId) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('rqg_theme_id');
    if (saved && THEMES.some((t) => t.id === saved)) {
      return saved as ThemeId;
    }
    return 'dark-mystic';
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const currentTheme = THEMES.find((t) => t.id === currentThemeId) || THEMES[0];

  useEffect(() => {
    localStorage.setItem('rqg_theme_id', currentThemeId);
    
    // Apply theme class to document body
    const body = document.body;
    THEMES.forEach((t) => {
      body.classList.remove(`theme-${t.id}`);
    });
    body.classList.add(`theme-${currentThemeId}`);
  }, [currentThemeId]);

  const setTheme = (themeId: ThemeId) => {
    setCurrentThemeId(themeId);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentThemeId,
        currentTheme,
        setTheme,
        isThemeModalOpen,
        setIsThemeModalOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
