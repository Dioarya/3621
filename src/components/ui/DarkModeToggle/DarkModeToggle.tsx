import { Moon, Sun } from "lucide-react";
import { useId } from "react";

import { Toggle } from "@/components";
import { useTheme } from "@/hooks/useTheme";

export default function DarkModeToggle() {
  const toggleId = useId();
  const { setTheme, isDark } = useTheme();
  const switchTheme = (checked: boolean) => setTheme(checked ? "dark" : "light");

  const svgs = {
    off: <Sun stroke="currentColor" fill="currentColor" />,
    on: <Moon stroke="currentColor" fill="currentColor" />,
  };

  return <Toggle svg={svgs} id={toggleId} checked={isDark} onChange={switchTheme} />;
}
