import { Moon, Sun } from "lucide-react";
import { useId } from "react";

import { Toggle } from "@/components";
import { useTheme } from "@/hooks/useTheme";

const DarkModeToggle = () => {
  const toggleId = useId();
  const { setTheme, isDark } = useTheme();
  const switchTheme = (checked: boolean) => {
    if (import.meta.env.DEV)
      console.log(`[popup:darkmode] log: toggled - ${checked ? "dark" : "light"}`);
    setTheme(checked ? "dark" : "light");
  };

  const svgs = {
    off: <Sun stroke="currentColor" fill="currentColor" />,
    on: <Moon stroke="currentColor" fill="currentColor" />,
  };

  return <Toggle svg={svgs} id={toggleId} checked={isDark} onChange={switchTheme} />;
};

export default DarkModeToggle;
