import { createContext, useState, useContext, useEffect, useRef, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
const themeStorageItem = storage.defineItem<Theme>("local:theme", {
  fallback: "system",
});

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

  // load from storage on mount
  useEffect(() => {
    themeStorageItem.getValue().then((value) => {
      if (value) setTheme(value);
    });
  }, []);

  // apply and persist whenever theme changes
  useEffect(() => {
    // skip the initial render so we don't persist "system" before storage loads
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    if (theme !== "system") {
      root.classList.add(theme);
    }
    // keep localStorage in sync for the anti-flash inline script
    localStorage.setItem("theme", theme);
    // persist to browser storage as source of truth
    themeStorageItem.setValue(theme);
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
