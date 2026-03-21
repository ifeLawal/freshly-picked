import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

type ThemeContextValue = {
  isDarkMode: boolean;
  setDarkMode: (enabled: boolean) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const saved = await storage.getDarkMode();
      setIsDarkMode(saved);
      setLoaded(true);
    };
    load();
  }, []);

  const setDarkMode = useCallback(async (enabled: boolean) => {
    setIsDarkMode(enabled);
    await storage.setDarkMode(enabled);
  }, []);

  const value: ThemeContextValue = { isDarkMode: loaded ? isDarkMode : false, setDarkMode };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      isDarkMode: false,
      setDarkMode: async (_: boolean) => {},
    };
  }
  return ctx;
}
