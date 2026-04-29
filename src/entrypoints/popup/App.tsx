import "@/assets/tailwind.css";
import iconLight from "/icon-light.svg";
import iconDark from "/icon.svg";

import { Brand, DarkModeToggle, Navbar, Spinner } from "@/components";
import { usePopupSettings } from "@/hooks/useSettings";
import { useTheme } from "@/hooks/useTheme";
import { createSettingsStoreReadyPromise } from "@/utils/store";

export default function App() {
  const ready = usePopupSettings((state) => state.ready);
  void createSettingsStoreReadyPromise(usePopupSettings);
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
