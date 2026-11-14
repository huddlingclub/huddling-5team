import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'coffee-theme';
const ThemeContext = createContext(null);
const normalize = (value) => ['light', 'dark', 'system'].includes(value) ? value : 'system';

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => normalize(document.documentElement.dataset.theme));

  useLayoutEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    function apply() {
      document.documentElement.classList.toggle('dark', preference === 'dark' || (preference === 'system' && query.matches));
      document.documentElement.dataset.theme = preference;
    }
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, [preference]);

  useEffect(() => {
    function sync(event) {
      if (event.key === STORAGE_KEY || event.key === null) setPreference(normalize(event.newValue));
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const selectTheme = useCallback((nextPreference) => {
    const next = normalize(nextPreference);
    setPreference(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 저장이 차단돼도 현재 탭의 모드는 바꿀 수 있다.
    }
  }, []);

  const value = useMemo(() => ({ preference, selectTheme }), [preference, selectTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
