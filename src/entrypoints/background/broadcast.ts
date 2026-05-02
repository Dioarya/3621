import { browser } from "#imports";

import { MARKER_KEY, injectIsInjected } from "@/utils/marker";
import { type ProtocolMap } from "@/utils/messaging";

type MessageInput<T extends keyof ProtocolMap> = Parameters<ProtocolMap[T]>[0];

export async function broadcastToMarkedTabs<T extends keyof ProtocolMap>(
  type: T,
  data: MessageInput<T>,
): Promise<void> {
  const tabs = await browser.tabs.query({});

  await Promise.allSettled(
    tabs
      .filter((tab) => tab.id != null)
      .map(async (tab) => {
        const test = await browser.scripting.executeScript({
          target: { tabId: tab.id! },
          func: injectIsInjected,
          args: [MARKER_KEY],
        });

        const isMarked = test[0]?.result === true;
        if (!isMarked) return;

        await browser.tabs.sendMessage(tab.id!, { type, data });
      }),
  );
}
