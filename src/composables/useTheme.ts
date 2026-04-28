export function useTheme() {
  const theme = useSettings((state) => state.theme);

  const setTheme = async (value: Theme) => {
    await sendMessage("theme.set", value);
  };

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    if (theme !== "system") {
      root.classList.add(theme);
    }
  }, [theme]);

  return { theme, setTheme, isDark };
}
