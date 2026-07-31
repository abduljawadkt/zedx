"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

type ThemeMode = "dark" | "light";

type ThemeContextValue = {
  isLight: boolean;
  setTheme: (theme: ThemeMode) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "zedx-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isLight: false,
      setTheme: () => {},
      theme: "dark",
      toggleTheme: () => {},
    }),
    [],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
