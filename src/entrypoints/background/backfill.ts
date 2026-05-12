import type { ScriptPublicPath } from "wxt/utils/inject-script";

import { browser, type Browser } from "wxt/browser";
import { MatchPattern } from "wxt/utils/match-patterns";

import { injectIsInjected, MARKER_KEY } from "@/utils/marker";

function createInjectContentScript(matches: string[], contentScript: ScriptPublicPath) {
  const injectionGate = async (target: { tabId: number }) => {
    const test = await browser.scripting.executeScript({
      target,
      func: injectIsInjected,
      args: [MARKER_KEY],
    });
    const already = test[0]?.result === true;
    if (import.meta.env.DEV)
      console.log(
        `[background:backfill] log: tab ${target.tabId} - ${already ? "already injected, skipping" : "injecting content script"}`,
      );
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
      const id = tab.id;
      const url = tab.url;
      if (!id || !url) continue;
      const matched = patterns.some((pattern) => pattern.includes(url));
      if (import.meta.env.DEV && matched)
        console.log(`[background:backfill] log: matched tab ${id} - ${url}`);
      if (matched) results.push(await injectionGate({ tabId: id }));
    }
    if (import.meta.env.DEV)
      console.log(
        `[background:backfill] log: backfill done - ${results.length} tab(s) matched out of ${tabs.length} total`,
      );
    return results;
  };

  return [tabsInjector] as const;
}

export function setupBackfill() {
  const [injectContentScripts] = createInjectContentScript(
    ["*://e621.net/posts/*"],
    "/content-scripts/content.js",
  );

  browser.runtime.onInstalled.addListener(async () => {
    const tabs = await browser.tabs.query({});
    if (import.meta.env.DEV)
      console.log(
        `[background:backfill] log: extension installed/updated, scanning ${tabs.length} open tab(s)`,
      );
    injectContentScripts(tabs).catch((err) => console.error("[background:backfill] error:", err));
  });
}
