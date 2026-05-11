import "@/assets/global.css";
import iconLight from "/icon-light.svg";
import iconDark from "/icon.svg";
import { name, version, repository } from "@@/package.json";
import { useState } from "react";

import { Page, Navbar } from "@/components/layout";
import { Brand, DarkModeToggle, Bar, Spinner, ScrollHighlight, Section } from "@/components/ui";
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
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null);

  if (!ready) {
    return <Spinner />;
  }

  // v${version} is used because __VERSION__ is too long
  return (
    <>
      <Page ref={setScrollElement}>
        <Section.Provider>
          <Navbar>
            <Bar color="rgb(from var(--color-surface-primary-100) r g b / 1)" blur="3px">
              <Bar.Left>
                <Brand>
                  <Brand.Logo>
                    <a href={repository.url} target="_blank" rel="noopener noreferer">
                      <img src={icon} />
                    </a>
                  </Brand.Logo>
                  <Brand.Text>
                    <a href={repository.url} target="_blank" rel="noopener noreferer">
                      {name}
                    </a>
                  </Brand.Text>
                  <Brand.Subscript>
                    <a href={releaseLink} target="_blank" rel="noopener noreferer">
                      {`v${version}`}
                    </a>
                  </Brand.Subscript>
                </Brand>
              </Bar.Left>
              <Bar.Right>
                <DarkModeToggle />
              </Bar.Right>
            </Bar>
            <Section.Navbar
              color="rgb(from var(--color-surface-primary-100) r g b / 1)"
              blur="3px"
            />
          </Navbar>
          <Section.Content>
            <Section.Content.Page pageKey={"settings"} pageLabel="Settings">
              <SettingsView />
            </Section.Content.Page>
          </Section.Content>
        </Section.Provider>
        <ScrollHighlight scrollElement={scrollElement} />
      </Page>
    </>
  );
}
