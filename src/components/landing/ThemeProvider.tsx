'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'sore';

const themes: Theme[] = ['dark', 'sore'];
const labels: Record<Theme, string> = {
  dark: 'Malam',
  sore: 'Sore',
};

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  cycle: () => void;
  label: string;
}>({ theme: 'dark', setTheme: () => {}, cycle: () => {}, label: 'Malam' });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved && themes.includes(saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    setMounted(true);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  const cycle = () => {
    const idx = themes.indexOf(theme);
    const next = themes[(idx + 1) % themes.length];
    setTheme(next);
  };

  if (!mounted) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycle, label: labels[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}
