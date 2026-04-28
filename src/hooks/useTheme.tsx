import { ReactNode, useEffect } from "react";

import type { Theme } from "@/utils/settings";

import { sendMessage } from "@/utils/messaging";

import { usePopupSettings } from "./useSettings";

export function useTheme() {
  const theme = usePopupSettings((state) => state.theme);

  const setTheme = async (value: Theme) => {
    await sendMessage("theme.set", value);
  };

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return { theme, setTheme, isDark };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    if (theme !== "system") root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
