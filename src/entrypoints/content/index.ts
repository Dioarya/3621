import { defineContentScript, type ContentScriptContext } from "#imports";
import {
  name as scriptName,
  version as scriptVersion,
  description as scriptDescription,
} from "@@/package.json";

import { isAlreadyInjected, markAsInjected } from "@/utils/marker";
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

  applySettings(elements, useContentSettings.getState());
  const unsubs = setupSubscriptions(elements);

  ctx.onInvalidated(() => {
    unsubs.forEach((unsub) => unsub());
  });
}

export default defineContentScript({
  matches: ["*://e621.net/posts/*"],
  main(ctx: ContentScriptContext) {
    if (!ctx.isValid) {
      console.log("Hello... content? Something has gone wrong. (invalid)");
      return;
    }

    if (isAlreadyInjected()) {
      console.log(
        `${scriptName} v${scriptVersion} "${scriptDescription}" (noop: already injected)`,
      );
      return;
    }

    markAsInjected();
    console.log(`${scriptName} v${scriptVersion} "${scriptDescription}"`);
    init(ctx).catch((err) => console.error("e6hancer init error:", err));
  },
});
