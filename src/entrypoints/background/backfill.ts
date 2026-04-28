import { browser, type Browser, MatchPattern, type ScriptPublicPath } from "#imports";

function createInjectContentScript(matches: string[], contentScript: ScriptPublicPath) {
  const patterns = matches.map((match) => new MatchPattern(match));
  const tabsInjector = async (tabs: Browser.tabs.Tab[]) => {
    const results = [];
    for (const tab of tabs) {
      if (!tab.id || !tab.url) continue;
      const matched = patterns.some((pattern) => pattern.includes(tab.url!));
      if (matched) {
        results.push(
          await browser.scripting.executeScript({
            target: { tabId: tab.id },
            files: [contentScript],
          }),
        );
      }
    }
    return results;
  };

  const tabInjector = async ({
    id,
    url,
    frame,
  }: {
    id?: number | undefined;
    url?: string | undefined;
    frame?: number;
  }) => {
    if (!id || !url) return;
    if (patterns.some((pattern) => pattern.includes(url))) {
      return await browser.scripting.executeScript({
        target: { tabId: id, frameIds: frame ? [frame] : undefined },
        files: [contentScript],
      });
    }
  };

  return [tabsInjector, tabInjector] as const;
}

const [injectContentScripts, injectContentScript] = createInjectContentScript(
  ["*://e621.net/posts/*"],
  "/content-scripts/content.js",
);

export function setupBackfill() {
  browser.webNavigation.onCommitted.addListener((details) => {
    injectContentScript({
      id: details.tabId,
      url: details.url,
    });
  });

  browser.runtime.onInstalled.addListener(async () => {
    const tabs = await browser.tabs.query({});
    injectContentScripts(tabs);
  });
}
