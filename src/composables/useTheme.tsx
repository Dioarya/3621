import { createContext, useState, useContext, useEffect, useRef, ReactNode } from "react";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const isMounted = useRef(false);
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // load from background on mount
  useEffect(() => {
    sendMessage("theme.get", undefined).then((value) => {
      if (value) setTheme(value);
    });
  }, []);

  // apply to DOM and persist to background whenever theme changes
  useEffect(() => {
    // skip the initial render so we don't persist "system" at startup
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    if (theme !== "system") {
      root.classList.add(theme);
    }
    sendMessage("theme.set", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
