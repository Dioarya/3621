import type { RemoveListenerCallback } from "@webext-core/messaging";

import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

import type { AcknowledgedTab } from "@/utils/lifetime";

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

    const acknowledgementExpireInterval = setInterval(async () => {
      const now = Date.now();

      const keepExpiration = (tab: AcknowledgedTab) => {
        const lastTime = tab.acknowledgement.heartbeat.lastTime;
        const interval = tab.acknowledgement.heartbeat.interval;
        const expectedNextTime = lastTime + interval;
        if (now > expectedNextTime) {
          return false;
        }

        return true;
      };

      await lifetime.tabs.set((tabs) => {
        const filtered = tabs.filter(keepExpiration);
        if (import.meta.env.DEV) {
          const expired = tabs.length - filtered.length;
          if (expired > 0)
            console.log(
              `[background] log: expired ${expired} tab(s), ${filtered.length} remaining`,
            );
        }
        return filtered;
      });
    }, lifetime.heartbeat.interval);

    browser.runtime.onSuspend.addListener(() => {
      if (import.meta.env.DEV) console.log("[background] log: suspending, cleaning up");
      cleanup.forEach((clean) => clean());
      clearInterval(acknowledgementExpireInterval);
    });

    console.log(scriptTitle);
  },
});
