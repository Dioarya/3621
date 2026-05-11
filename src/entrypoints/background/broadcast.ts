import { type ProtocolMap, sendMessage } from "@/utils/messaging";

import { type Lifetime } from "./lifetime.ts";

type MessageInput<T extends keyof ProtocolMap> = Parameters<typeof sendMessage<T>>[1];

export function broadcastToMarkedTabs<T extends keyof ProtocolMap>(
  lifetime: Lifetime,
  type: T,
  data: MessageInput<T>,
) {
  return lifetime.tabs.use((tabs) =>
    tabs
      .flatMap((acknowledgedTab) =>
        (acknowledgedTab.tab.frames ?? []).map((frame) => ({
          status: acknowledgedTab.tab.status,
          tabId: acknowledgedTab.tab.id,
          frameId: frame.frameId,
        })),
      )
      .map(({ tabId, frameId }) => {
        return sendMessage(type, data, { tabId, frameId });
      }),
  );
}
