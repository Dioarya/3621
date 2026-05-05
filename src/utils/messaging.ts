import { defineExtensionMessaging } from "@webext-core/messaging";

import { Acknowledgement } from "./lifetime";
import { Theme, VerticalConstraint, Align, LiveUpdate, Settings } from "./settings";

export interface ProtocolMap {
  // e621.net settings {
  // theme
  "theme.get"(): Theme; // * -> background
  "theme.set"(data: Theme): void; // * -> background

  // align
  "align.get"(): Align; // * -> background
  "align.set"(data: Align): void; // * -> background

  // verticalConstraint
  "verticalConstraint.get"(): VerticalConstraint; // * -> background
  "verticalConstraint.set"(data: VerticalConstraint): void; // * -> background

  // liveUpdate
  "liveUpdate.get"(): LiveUpdate; // * -> background
  "liveUpdate.set"(data: LiveUpdate): void; // * -> background

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
): ReturnType<typeof sendMessage<T>> {
  return sendMessage(...args).catch((err) => {
    if (err?.message?.includes(NO_RECEIVER_ERROR)) return;
    throw err;
  }) as ReturnType<typeof sendMessage<T>>;
}
