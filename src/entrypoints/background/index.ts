import type { RemoveListenerCallback } from "@webext-core/messaging";

import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

import { getScriptTitle } from "@/utils/hello";

import { setupBackfill } from "./backfill";
import { Lifetime } from "./lifetime";
import { setupMessaging } from "./messaging";

export default defineBackground({
  persistent: true,
  main() {
    const scriptTitle = getScriptTitle();

    const cleanup: RemoveListenerCallback[] = [];

    const lifetime = new Lifetime({
      heartbeat: {
        interval: (import.meta.env.DEV ? 1 : 60) * 1000,
        safeIntervalMultiplier: 0.8,
      },
    });

    cleanup.push(...setupMessaging(lifetime));
    setupBackfill();

    browser.runtime.onSuspend.addListener(() => {
      if (import.meta.env.DEV) console.log("[background] log: suspending, cleaning up");
      cleanup.forEach((clean) => clean());
    });

    console.log(scriptTitle);
  },
});
