import "@/assets/global.css";
import iconLight from "/icon-light.svg";
import iconDark from "/icon.svg";
import { version } from "@@/package.json";

import { Brand, Page, Navbar, DarkModeToggle, Bar, Spinner, ScrollHighlight } from "@/components";
import { usePopupSettings } from "@/hooks/useSettings";
import { useTheme } from "@/hooks/useTheme";
import { fetchSettingsStore } from "@/utils/store";

export default function App() {
  void fetchSettingsStore(usePopupSettings);
  const ready = usePopupSettings((state) => state.ready);
  const { isDark } = useTheme();
  const icon = isDark ? iconDark : iconLight;

  if (!ready) {
    return <Spinner />;
  }

  return (
    <>
      <Page>
        <Navbar>
          <Bar color="rgb(from var(--color-surface-primary-100) r g b / 1)" blur="3px">
            <Bar.Left>
              <Brand logo={icon} title="e6hancer" subscript={`v${version}`} />
            </Bar.Left>
            <Bar.Right>
              <DarkModeToggle />
            </Bar.Right>
          </Bar>
        </Navbar>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam laoreet ut risus non
          gravida. Mauris nisi dolor, dignissim eget ex vitae, tempus interdum arcu. Nam non tellus
          euismod, mollis ex nec, maximus sem. Vivamus eleifend mollis metus, id pulvinar nunc
          pulvinar eu. Duis aliquam, sem sed molestie euismod, lacus nisi sodales massa, sit amet
          tempus est nulla ut erat. Quisque elementum consequat leo ac consectetur. In quam lectus,
          lobortis et tincidunt eget, placerat vitae ex. Vestibulum non dictum tortor. Duis
          dignissim pharetra eros, vitae convallis nulla dictum ac. Suspendisse a metus consequat,
          molestie turpis id, mattis nunc. Aliquam purus justo, malesuada a suscipit et, placerat
          vel risus. Morbi ultrices dapibus lacinia. Duis ultricies pulvinar diam, et tincidunt
          risus bibendum at. Donec nec mi ligula. Duis egestas erat at orci viverra dapibus. Sed
          vitae sem sollicitudin, molestie justo id, tristique erat. In hac habitasse platea
          dictumst. Vestibulum aliquam orci id turpis porta, vitae auctor felis egestas. Duis
          pellentesque tincidunt ante eu blandit. Nullam placerat at enim at tincidunt. Praesent
          ornare, neque sit amet efficitur imperdiet, velit nisi blandit nunc, vitae pretium mauris
          neque in turpis. Proin tincidunt leo eget consectetur cursus. Nunc eleifend leo eget
          semper pharetra. Sed nisi libero, pulvinar ac risus at, imperdiet feugiat augue. Sed
          tempus mattis nunc sit amet tempor. Ut ut lobortis felis. Donec tincidunt purus laoreet
          quam tempus, nec porttitor libero condimentum. Maecenas arcu lectus, fringilla ut faucibus
          eu, rutrum in ligula. Donec facilisis fringilla urna, non tempus sapien mattis sed. Ut
          purus justo, ultrices id vulputate vel, facilisis ut dui. Nulla risus ligula, blandit ut
          commodo at, tristique ut quam. Suspendisse porttitor accumsan ligula, sit amet molestie
          ligula rhoncus eget. In ullamcorper elit varius sem volutpat, at consequat dui accumsan.
          Praesent varius ornare est, id ullamcorper metus mattis ac. Quisque eros arcu, placerat in
          consequat non, viverra et orci. Morbi dolor nulla, rhoncus sed vestibulum vitae, pharetra
          sed eros. Mauris vel risus varius, venenatis velit et, aliquet nibh. In sagittis in nisl
          sed sagittis. Sed a enim varius, efficitur nisl at, lobortis massa. Interdum et malesuada
          fames ac ante ipsum primis in faucibus. Fusce eros erat, molestie a porttitor non, rhoncus
          quis nisi. Phasellus lacinia turpis rutrum leo auctor, vitae tincidunt leo venenatis.
          Nullam quis blandit dolor. Duis eu justo nec nulla tincidunt porta. Sed non diam luctus,
          euismod odio in, accumsan turpis. Suspendisse at massa tellus. Nam at ipsum erat. Praesent
          eget ligula nulla. Nunc non dolor nec nulla varius pretium a luctus est. Aliquam erat
          volutpat. Praesent sit amet tellus orci. Fusce mi eros, suscipit eget magna a, volutpat
          imperdiet nisl. Mauris lorem libero, lacinia vitae sollicitudin sed, ultricies sit amet
          ex. Proin et neque enim. Nulla venenatis varius diam, eget venenatis augue scelerisque at.
          Mauris ornare lorem nec nisl posuere, commodo consectetur sem pellentesque. Proin
          efficitur ornare purus, at accumsan est lacinia et. Suspendisse erat ipsum, ornare in
          ligula sed, tincidunt fringilla risus. Nunc dictum sem a interdum vulputate. Aenean
          placerat ultricies tortor, id condimentum purus lobortis nec. Praesent posuere euismod.
        </div>
        <ScrollHighlight />
      </Page>
    </>
  );
}
