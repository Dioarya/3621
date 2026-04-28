import type { RemoveListenerCallback } from "@webext-core/messaging";

import { browser, defineBackground } from "#imports";

import { setupBackfill } from "./backfill";
import { setupMessaging } from "./messaging";

export default defineBackground({
  persistent: true,
  main() {
    const cleanup: RemoveListenerCallback[] = [];

    cleanup.push(...setupMessaging());
    setupBackfill();

    browser.runtime.onSuspend.addListener(() => {
      cleanup.forEach((clean) => clean());
    });
  },
});
