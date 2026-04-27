import { ContentScriptContext } from "#imports";
import injectStyle from "./style.css?inline";
import {
  name as scriptName,
  version as scriptVersion,
  description as scriptDescription,
} from "@@/package.json";

async function waitForElement(selector: string): Promise<Element> {
  return new Promise((resolve) => {
    const existing = document.querySelector(selector);
    if (existing != null) return resolve(existing);
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

async function init(ctx: ContentScriptContext): Promise<void> {
  const image = await waitForElement("#image");
  const imageContainer = await waitForElement("#image-container");
  const alignContainer = await waitForElement("#image-and-nav");

  const style = document.createElement("style");
  style.textContent = injectStyle;
  document.head.appendChild(style);
}

export default defineContentScript({
  matches: ["*://e621.net/posts/*"],
  main(ctx: ContentScriptContext) {
    if (ctx.isValid) {
      console.log(`${scriptName} v${scriptVersion} "${scriptDescription}"`);
      init(ctx).catch((err) => console.error("e6hancer init error:", err));
    } else {
      console.log("Hello... content? Something has gone wrong. (invalid)");
    }
  },
});
