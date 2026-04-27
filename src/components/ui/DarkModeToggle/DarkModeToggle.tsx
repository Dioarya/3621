import style from "./DarkModeToggle.module.css";
type DarkModeToggleProps = {};

export default function DarkModeToggle({}: DarkModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const switchTheme = (checked: boolean) => setTheme(checked ? "dark" : "light");
  return <Toggle className={style.toggle} checked={theme === "dark"} onChange={switchTheme} />;
}
