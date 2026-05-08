import "@/assets/global.css";
import iconLight from "/icon-light.svg";
import iconDark from "/icon.svg";
import { name, version, repository } from "@@/package.json";

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
import { SettingsView } from "@/views";

export default function App() {
  void fetchSettingsStore(usePopupSettings);
  const ready = usePopupSettings((state) => state.ready);
  const { isDark } = useTheme();
  const icon = isDark ? iconDark : iconLight;
  const releaseLink = repository.url + `/releases/tag/v${version}`;

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
                    <Brand.Logo src={icon} />
                    <Brand.Text>{name}</Brand.Text>
                    <Brand.Subscript>
                      <a
                        href={releaseLink}
                        target="_blank"
                        rel="noopener noreferer"
                      >{`v${version}`}</a>
                    </Brand.Subscript>
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
              <SettingsView />
            </Section.Content.Page>
          </Section.Content>
        </Section.Provider>
        <ScrollHighlight />
      </Page>
    </>
  );
}
