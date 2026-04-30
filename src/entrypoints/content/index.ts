import type { throttle } from "throttle-debounce";

import { defineContentScript, type ContentScriptContext } from "#imports";
import {
  name as scriptName,
  version as scriptVersion,
  description as scriptDescription,
} from "@@/package.json";

import { disposableAddEventListener } from "@/utils/event";
import { isInjected, markAsInjected } from "@/utils/marker";
import { createSettingsStoreReadyPromise } from "@/utils/store";

import { useContentSettings } from "./store";
import injectStyle from "./style.css?inline";
import { applySettings, setupSubscriptions } from "./subscriptions";

async function waitForElement(selector: string): Promise<HTMLElement> {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLElement>(selector);
    if (existing != null) return resolve(existing);
    const observer = new MutationObserver(() => {
      const element = document.querySelector<HTMLElement>(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

async function init(ctx: ContentScriptContext): Promise<void> {
  await createSettingsStoreReadyPromise(useContentSettings);

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
  const unsubs = setupSubscriptions(ctx, elements);

  ctx.onInvalidated(() => {
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
      console.log("Hello... content? Something has gone wrong. (invalid)");
      return;
    }

    const scriptTitle = `${scriptName} v${scriptVersion} "${scriptDescription}"`;

    if (isInjected()) {
      console.log(`${scriptTitle} (noop: already injected)`);
      return;
    }

    markAsInjected();
    console.log(scriptTitle);
    init(ctx).catch((err) => console.error("e6hancer init error:", err));
  },
});
