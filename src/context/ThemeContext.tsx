import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks';

type Theme = 'light' | 'dark';
type TThemeContext = {
  theme: Theme;
  toggleTheme: () => void;
};
type TThemeProviderProps = {
  children: ReactNode;
};

const THEME_KEY = 'theme';
const defaultValue = 'light';

export const ThemeContext = React.createContext<TThemeContext>(
  {} as TThemeContext
);

export const ThemeProvider: React.FunctionComponent<TThemeProviderProps> = ({
  children
}) => {
  const [theme, setTheme] = useState<Theme>(defaultValue);
  const [themeLocal, setThemeLocal] = useLocalStorage<Theme>(
    THEME_KEY,
    defaultValue
  );

  useEffect(() => {
    if (theme !== themeLocal) {
      themeSetter(themeLocal);
    }
  }, []);

  const themeSetter = useCallback((theme: Theme) => {
    setTheme(theme);
    setThemeLocal(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';

    themeSetter(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
