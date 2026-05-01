import { Moon, Sun } from "lucide-react";
import { useId } from "react";

import { Toggle } from "@/components";
import { useTheme } from "@/hooks/useTheme";

import style from "./DarkModeToggle.module.css";

export default function DarkModeToggle() {
  const toggleId = useId();
  const { setTheme, isDark } = useTheme();
  const switchTheme = (checked: boolean) => setTheme(checked ? "dark" : "light");

  const svgs = {
    off: <Sun size={14} stroke="currentColor" fill="currentColor" />,
    on: <Moon size={14} stroke="currentColor" fill="currentColor" />,
  };

  return (
    <div className={style.container}>
      <label className={style.label} htmlFor={toggleId}>
        Dark Mode
      </label>
      <div className={style.toggle}>
        <Toggle svg={svgs} id={toggleId} checked={isDark} onChange={switchTheme} />
      </div>
    </div>
  );
}
