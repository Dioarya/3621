import "@/assets/global.css";
import iconLight from "/icon-light.svg";
import iconDark from "/icon.svg";
import { version, repository } from "@@/package.json";

import {
  Brand,
  Page,
  Navbar,
  DarkModeToggle,
  Bar,
  Spinner,
  ScrollHighlight,
  Section,
} from "@/components";
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
            <Section.Content.Page pageKey={"1"} pageLabel="1">
              Page 1
            </Section.Content.Page>
            <Section.Content.Page pageKey={"2"} pageLabel="2">
              Page 2
            </Section.Content.Page>
            <Section.Content.Page pageKey={"3"} pageLabel="3">
              Page 3
            </Section.Content.Page>
            <Section.Content.Page pageKey={"4"} pageLabel="4">
              Page 4
            </Section.Content.Page>
            <Section.Content.Page pageKey={"5"} pageLabel="5">
              Page 5
            </Section.Content.Page>
            <Section.Content.Page pageKey={"6"} pageLabel="6">
              Page 6
            </Section.Content.Page>
            <Section.Content.Page pageKey={"7"} pageLabel="7">
              Page 7
            </Section.Content.Page>
            <Section.Content.Page pageKey={"8"} pageLabel="8">
              Page 8
            </Section.Content.Page>
            <Section.Content.Page pageKey={"9"} pageLabel="9">
              Page 9
            </Section.Content.Page>
            <Section.Content.Page pageKey={"10"} pageLabel="10">
              Page 10
            </Section.Content.Page>
          </Section.Content>
        </Section.Provider>
        <ScrollHighlight />
      </Page>
    </>
  );
}
