import { type ReactNode, useEffect } from "react";

import { useSettingsControls } from "./useSettings";

export function useTheme() {
  const { theme } = useSettingsControls();

  const isDark =
    theme.value === "dark" ||
    (theme.value === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return { theme: theme.value, setTheme: theme.update, isDark };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    if (theme !== "system") root.classList.add(theme);
    if (import.meta.env.DEV) console.log(`[popup:theme] log: theme applied: theme=${theme}`);
  }, [theme]);

  return <>{children}</>;
}
