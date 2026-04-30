import { browser, type Browser, MatchPattern, type ScriptPublicPath } from "#imports";

import { injectIsInjected, MARKER_KEY } from "@/utils/marker";

function createInjectContentScript(matches: string[], contentScript: ScriptPublicPath) {
  const injectionGate = async (target: { tabId: number }) => {
    const test = await browser.scripting.executeScript({
      target,
      func: injectIsInjected,
      args: [MARKER_KEY],
    });
    const already = test[0]?.result === true;
    if (!already) {
      return await browser.scripting.executeScript({
        target,
        files: [contentScript],
      });
    }
  };

  const patterns = matches.map((match) => new MatchPattern(match));

  const tabsInjector = async (tabs: Browser.tabs.Tab[]) => {
    const results = [];
    for (const tab of tabs) {
      if (!tab.id || !tab.url) continue;
      const matched = patterns.some((pattern) => pattern.includes(tab.url!));
      if (matched) {
        const target = { tabId: tab.id };
        results.push(await injectionGate(target));
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
      const target = { tabId: id, frameIds: frame ? [frame] : undefined };
      return await injectionGate(target);
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
    }).catch(console.error);
  });

  browser.runtime.onInstalled.addListener(async () => {
    const tabs = await browser.tabs.query({});
    injectContentScripts(tabs).catch(console.error);
  });
}
