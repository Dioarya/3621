import { RemoveListenerCallback } from "@webext-core/messaging";
import { setupMessaging } from "./messaging";

export default defineBackground({
  persistent: true,
  main() {
    const cleanup: RemoveListenerCallback[] = [];
    cleanup.push(...setupMessaging());

    browser.runtime.onSuspend.addListener(() => {
      for (const clean of cleanup) {
        clean();
      }
    });
  },
});
