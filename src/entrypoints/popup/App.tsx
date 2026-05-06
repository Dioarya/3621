import "@/assets/global.css";
import iconLight from "/icon-light.svg";
import iconDark from "/icon.svg";
import { version, repository } from "@@/package.json";

import {
  Brand,
  Page,
  Navbar,
  Setting,
  DarkModeToggle,
  Bar,
  Spinner,
  ScrollHighlight,
  Section,
} from "@/components";
import { createSegmentedControl } from "@/components/ui/SegmentedControl/SegmentedControl";
import { usePopupSettings } from "@/hooks/useSettings";
import { useSettingsControls } from "@/hooks/useSettings";
import { useTheme } from "@/hooks/useTheme";
import { fetchSettingsStore } from "@/utils/store";

export default function App() {
  void fetchSettingsStore(usePopupSettings);
  const { verticalConstraint, align, liveUpdate } = useSettingsControls();
  const ready = usePopupSettings((state) => state.ready);
  const { isDark } = useTheme();
  const icon = isDark ? iconDark : iconLight;

  if (!ready) {
    return <Spinner />;
  }

  // v${version} is used because __VERSION__ is too long
  return (
    <>
      <Page>
        <Section.Provider>
          <Navbar>
            <Bar color="rgb(from var(--color-surface-primary-100) r g b / 1)" blur="3px">
              <Bar.Left>
                <a href={repository.url} target="_blank" rel="noopener noreferer">
                  <Brand>
                    <Brand.Logo src={icon} alt="e6hancer logo" />
                    <Brand.Text>e6hancer</Brand.Text>
                    <Brand.Subscript>{`v${version}`}</Brand.Subscript>
                  </Brand>
                </a>
              </Bar.Left>
              <Bar.Right>
                <DarkModeToggle />
              </Bar.Right>
            </Bar>
            <Section.Navbar />
          </Navbar>
          <Section.Content>
            <Section.Content.Page pageKey={"settings"} pageLabel="Settings">
              <Setting>
                <Setting.Label>Vertical Constraint</Setting.Label>
                <Setting.Description>It's a vertical constraint... r u fr</Setting.Description>
                <Setting.Input>
                  {createSegmentedControl(verticalConstraint.value, verticalConstraint.update, [
                    { label: "Off", value: "off" },
                    { label: "Full", value: "full" },
                    { label: "Margined", value: "margined" },
                  ])}
                </Setting.Input>
              </Setting>

              <Setting>
                <Setting.Label>Align</Setting.Label>
                <Setting.Description>It's an align... r u fr</Setting.Description>
                <Setting.Input>
                  {createSegmentedControl(align.value, align.update, [
                    { label: "Left", value: "left" },
                    { label: "Center", value: "center" },
                    { label: "Right", value: "right" },
                  ])}
                </Setting.Input>
              </Setting>

              <Setting>
                <Setting.Label>Live Update</Setting.Label>
                <Setting.Description>It's a live update... r u fr</Setting.Description>
                <Setting.Input>
                  {createSegmentedControl(liveUpdate.value, liveUpdate.update, [
                    { label: "Off", value: false },
                    { label: "On", value: true },
                  ])}
                </Setting.Input>
              </Setting>
            </Section.Content.Page>
          </Section.Content>
        </Section.Provider>
        <ScrollHighlight />
      </Page>
    </>
  );
}
