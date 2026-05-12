import type { throttle } from "throttle-debounce";
import type { ContentScriptContext } from "wxt/utils/content-script-context";

import { name as scriptName } from "@@/package.json";
import { defineContentScript } from "wxt/utils/define-content-script";

import { disposableAddEventListener } from "@/utils/event";
import { getScriptTitle } from "@/utils/hello";
import { markAsInjected } from "@/utils/marker";
import { fetchSettingsStore } from "@/utils/store";

import { applySettings } from "./apply";
import { setupLifetime } from "./lifetime";
import { useContentSettings } from "./store";
import injectStyle from "./style.css?inline";
import { setupSubscriptions } from "./subscriptions";

async function waitForElement(selector: string) {
  return new Promise((resolve: (value: HTMLElement) => void) => {
    const existing = document.querySelector<HTMLElement>(selector);
    if (existing != null) {
      if (import.meta.env.DEV)
        console.log(`[content] log: element found immediately - ${selector}`);
      return resolve(existing);
    }
    if (import.meta.env.DEV) console.log(`[content] log: waiting for element - ${selector}`);
    const observer = new MutationObserver(() => {
      const element = document.querySelector<HTMLElement>(selector);
      if (element) {
        if (import.meta.env.DEV) console.log(`[content] log: element appeared - ${selector}`);
        observer.disconnect();
        resolve(element);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

async function init(ctx: ContentScriptContext) {
  await fetchSettingsStore(useContentSettings);

  const image = await waitForElement("#image");
  const imageContainer = await waitForElement("#image-container");
  const alignContainer = await waitForElement("#image-and-nav");

  const elements = {
    image,
    imageContainer,
    alignContainer,
  };

  const style = document.createElement("style");
  style.textContent = injectStyle;
  document.head.appendChild(style);

  applySettings(ctx, elements, useContentSettings.getState());
  const cleanupLifetime = await setupLifetime(ctx);
  const unsubs = setupSubscriptions(ctx, elements);

  ctx.onInvalidated(() => {
    if (import.meta.env.DEV) console.log("[content] log: context invalidated, cleaning up");
    cleanupLifetime();
    unsubs.forEach((unsub) => unsub());
  });
}

type RuntimeObject = {
  throttleHandler?: ReturnType<typeof throttle>;
  eventCleanups?: ReturnType<typeof disposableAddEventListener>[];
};

export const runtimeObject: RuntimeObject = {};

export default defineContentScript({
  matches: ["*://e621.net/posts/*"],
  main(ctx: ContentScriptContext) {
    if (!ctx.isValid) {
      if (import.meta.env.DEV)
        console.log("[content] log: Hello... content? Something has gone wrong. (invalid)");
      return;
    }

    const scriptTitle = getScriptTitle();

    markAsInjected();
    console.log(scriptTitle);
    init(ctx)
      .then(() => {
        if (import.meta.env.DEV) console.log("[content] log: init complete");
      })
      .catch((err) => console.error("[content] error:", `${scriptName} init error:`, err));
  },
});
