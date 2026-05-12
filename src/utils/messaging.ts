import { defineExtensionMessaging } from "@webext-core/messaging";

import type { Acknowledgement } from "./lifetime";
import type { Settings } from "./settings";

// creates *.get and *.set protocols for each key inside Settings,
// such as theme.get & theme.set and liveUpdate.get & liveUpdate.set
type SettingsProtocol = {
  [K in keyof Settings as `${K}.get`]: () => Settings[K];
} & {
  [K in keyof Settings as `${K}.set`]: (data: Settings[K]) => void;
};

export interface ProtocolMap extends SettingsProtocol {
  // e621.net settings {
  // settings
  "settings.get"(): Settings; // * -> background
  "settings.update"(data: Partial<Settings>): void; // background -> many content-script
  // } e621.net settings

  // lifetime  {
  "lifetime.acknowledge"(): Acknowledgement; // content -> background
  "lifetime.heartbeat"(): Acknowledgement; // content -> background, updates background internal state for a tab
  // } lifetime
}

// oxlint-disable-next-line typescript/unbound-method
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();

const NO_RECEIVER_ERROR = "Could not establish connection. Receiving end does not exist.";
export function sendMessageSafe<T extends keyof ProtocolMap>(
  ...args: Parameters<typeof sendMessage<T>>
) {
  return sendMessage(...args).catch((err) => {
    if (err?.message?.includes(NO_RECEIVER_ERROR)) {
      if (import.meta.env.DEV)
        console.log(`[messaging] log: no receiver for "${args[0]}", silently ignoring`);
      return;
    }
    throw err;
  }) as ReturnType<typeof sendMessage<T>>;
}
