import type { RemoveListenerCallback } from "@webext-core/messaging";

import { browser, defineBackground } from "#imports";

import { getScriptTitle } from "@/utils/hello";

import { setupBackfill } from "./backfill";
import { setupMessaging } from "./messaging";

export default defineBackground({
  persistent: true,
  main() {
    const scriptTitle = getScriptTitle();

    const cleanup: RemoveListenerCallback[] = [];

    cleanup.push(...setupMessaging());
    setupBackfill();

    browser.runtime.onSuspend.addListener(() => {
      cleanup.forEach((clean) => clean());
    });
    console.log(scriptTitle);
  },
});
