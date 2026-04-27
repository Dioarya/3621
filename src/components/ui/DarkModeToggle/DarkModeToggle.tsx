import style from "./DarkModeToggle.module.css";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const switchTheme = (checked: boolean) => setTheme(checked ? "dark" : "light");
  return <Toggle className={style.toggle} checked={theme === "dark"} onChange={switchTheme} />;
}
