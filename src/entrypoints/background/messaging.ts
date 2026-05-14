import type { RemoveListenerCallback } from "@webext-core/messaging";

import type { Settings } from "@/utils/settings";

import { onMessage, sendMessageSafe, type ProtocolMap } from "@/utils/messaging";
import { traverseSet, type MultiKeyFlat, type MultiValue } from "@/utils/multi";
import { settingsStorageItems } from "@/utils/storage";
import { DeepPartial } from "@/utils/types";

import type { Lifetime } from "./object";

import { broadcastToMarkedTabs } from "./broadcast";
import { setupAcknowledgementExpiry, setupLifetimeMessaging } from "./lifetime";

async function getAllSettings() {
  const keys = settingsStorageItems.keys;
  const settings = {} as Settings;

  for (const key of keys) {
    const value = await settingsStorageItems.item(key).getValue();
    traverseSet(settings, key, value, { parents: true });
  }

  return settings;
}

function createGetAndSet(prop: MultiKeyFlat<Settings>, options?: { get?: boolean; set?: boolean }) {
  const get = options?.get ?? true;
  const set = options?.set ?? true;

  const result: {
    get?: RemoveListenerCallback;
    set?: RemoveListenerCallback;
  } = {};

  if (get) {
    const getterMessage = `${prop}.get` as keyof ProtocolMap;
    result.get = onMessage(getterMessage, async () => {
      const item = settingsStorageItems.item(prop);
      return item.getValue();
    });
  }

  if (set) {
    const setterMessage = `${prop}.set` as keyof ProtocolMap;
    result.set = onMessage(setterMessage, async ({ data }) => {
      const item = settingsStorageItems.item(prop);
      await item.setValue(data as MultiValue<Settings, typeof prop>);
      await item.setMeta({ lastModified: Date.now(), version: 1 });
    });
  }

  return result;
}

function createWatch(lifetime: Lifetime, prop: MultiKeyFlat<Settings>) {
  return settingsStorageItems.item(prop).watch(async (newValue) => {
    const update = {} as DeepPartial<Settings>;
    traverseSet(update as unknown as Settings, prop, newValue, { parents: true });

    if (import.meta.env.DEV)
      console.log(`[background:messaging] log: setting changed: ${prop}=`, newValue);

    void sendMessageSafe("settings.update", update);

    const broadcasts = await broadcastToMarkedTabs(lifetime, "settings.update", update);
    void Promise.allSettled(broadcasts).then((results) => {
      if (import.meta.env.DEV)
        console.log(
          `[background:messaging] log: broadcast ${prop} to ${results.length} frame(s), ${results.filter((r) => r.status === "rejected").length} failed`,
        );
      results
        .filter((result) => result.status === "rejected")
        .forEach((result) => console.error("[background:messaging] error:", result.reason));
    });
  });
}

export function setupMessaging(lifetime: Lifetime) {
  const cleanup: RemoveListenerCallback[] = [];

  cleanup.push(
    onMessage("settings.get", async () => {
      const settings = await getAllSettings();
      if (import.meta.env.DEV)
        console.log("[background:messaging] log: settings.get requested -", settings);
      return settings;
    }),
  );

  const props = settingsStorageItems.keys;
  for (const prop of props) {
    cleanup.push(...Object.values(createGetAndSet(prop)));
    cleanup.push(createWatch(lifetime, prop));
  }

  cleanup.push(...setupLifetimeMessaging(lifetime));
  cleanup.push(setupAcknowledgementExpiry(lifetime));

  return cleanup;
}
