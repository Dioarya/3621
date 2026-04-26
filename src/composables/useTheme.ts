import { useState, useEffect, useRef } from "react";

type Theme = "light" | "dark" | "system";
const themeStorageItem = storage.defineItem<Theme>("local:theme", {
  fallback: "system",
});

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  const isMounted = useRef(false);

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

  return { theme, setTheme };
}
