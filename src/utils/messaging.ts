import { defineExtensionMessaging } from "@webext-core/messaging";
import { Theme, VerticalConstraint, Align, LiveUpdate } from "./settings";

interface ProtocolMap {
  // theme
  "theme.get"(): Theme;
  "theme.set"(data: Theme): void;

  // align
  "align.get"(): Align;
  "align.set"(data: Align): void;

  // verticalConstraint
  "verticalConstraint.get"(): VerticalConstraint;
  "verticalConstraint.set"(data: VerticalConstraint): void;

  // liveUpdate
  "liveUpdate.get"(): LiveUpdate;
  "liveUpdate.set"(data: LiveUpdate): void;

  // settings
  "settings.get"(): Settings;
}
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
