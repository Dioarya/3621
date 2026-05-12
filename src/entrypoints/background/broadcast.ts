import { type ProtocolMap, sendMessage } from "@/utils/messaging";

import { type Lifetime } from "./lifetime.ts";

type MessageInput<T extends keyof ProtocolMap> = Parameters<typeof sendMessage<T>>[1];

export function broadcastToMarkedTabs<T extends keyof ProtocolMap>(
  lifetime: Lifetime,
  type: T,
  data: MessageInput<T>,
) {
  return lifetime.tabs.use((tabs) => {
    const frames = tabs.flatMap((acknowledgedTab) =>
      (acknowledgedTab.tab.frames ?? []).map((frame) => ({
        status: acknowledgedTab.tab.status,
        tabId: acknowledgedTab.tab.id,
        frameId: frame.frameId,
      })),
    );

    if (import.meta.env.DEV)
      console.log(
        `[background:broadcast] log: broadcasting "${type}" to ${frames.length} frame(s) across ${tabs.length} tab(s)`,
      );

    return frames.map(({ tabId, frameId }) => sendMessage(type, data, { tabId, frameId }));
  });
}
