import type { RemoveListenerCallback } from "@webext-core/messaging";

import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

import { getScriptTitle } from "@/utils/hello";

import { setupBackfill } from "./backfill";
import { expireAcknowledgements, Lifetime } from "./lifetime";
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

    const acknowledgementExpireInterval = setInterval(() => {
      expireAcknowledgements(lifetime, new Date().getTime());
    }, lifetime.heartbeat.interval);

    browser.runtime.onSuspend.addListener(() => {
      cleanup.forEach((clean) => clean());
      clearInterval(acknowledgementExpireInterval);
    });
    console.log(scriptTitle);
  },
});
