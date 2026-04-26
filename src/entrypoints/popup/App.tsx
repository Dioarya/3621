import icon from "/icon.svg";
import "@/assets/tailwind.css";

function App() {
  const { theme, setTheme } = useTheme();
  const switchTheme = (checked: boolean) => setTheme(checked ? "dark" : "light");
  return (
    <>
      <Navbar
        left={<Brand logo={icon} title="e6hancer" />}
        right={<Toggle checked={theme === "dark"} onChange={switchTheme} />}
      />
    </>
  );
}

export default App;
