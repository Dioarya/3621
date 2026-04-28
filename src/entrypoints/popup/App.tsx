import { useSettings } from "@/composables/useSettings";
import icon from "/icon.svg";
import "@/assets/tailwind.css";

export default function App() {
  const ready = useSettings((state) => state.ready);

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
