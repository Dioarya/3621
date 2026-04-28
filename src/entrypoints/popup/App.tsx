import "@/assets/tailwind.css";
import iconDark from "/icon.svg";
import iconLight from "/icon-light.svg";

export default function App() {
  const ready = useSettings((state) => state.ready);
  const { isDark } = useTheme();
  const icon = isDark ? iconDark : iconLight;

  if (!ready) {
    return <Spinner />;
  }

  return (
    <>
      <Navbar>
        <Navbar.Left>
          <Brand logo={icon} title="e6hancer" />
        </Navbar.Left>
        <Navbar.Right>
          <DarkModeToggle />
        </Navbar.Right>
      </Navbar>
    </>
  );
}
