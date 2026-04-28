import { defineExtensionMessaging } from "@webext-core/messaging";

import { Theme, VerticalConstraint, Align, LiveUpdate, Settings } from "./settings";

export interface ProtocolMap {
  // theme
  "theme.get"(): Theme; // one-to-one
  "theme.set"(data: Theme): void; // one-to-one

  // align
  "align.get"(): Align; // one-to-one
  "align.set"(data: Align): void; // one-to-one

  // verticalConstraint
  "verticalConstraint.get"(): VerticalConstraint; // one-to-one
  "verticalConstraint.set"(data: VerticalConstraint): void; // one-to-one

  // liveUpdate
  "liveUpdate.get"(): LiveUpdate; // one-to-one
  "liveUpdate.set"(data: LiveUpdate): void; // one-to-one

  // settings
  "settings.get"(): Settings; // one-to-one
  "settings.update"(data: Partial<Settings>): void; // one-to-many
}
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
