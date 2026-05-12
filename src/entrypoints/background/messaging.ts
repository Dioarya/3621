import type { RemoveListenerCallback } from "@webext-core/messaging";

import type { Settings } from "@/utils/settings";

import { onMessage, sendMessageSafe, type ProtocolMap } from "@/utils/messaging";
import { settingsStorageItems } from "@/utils/storage";

import { broadcastToMarkedTabs } from "./broadcast";
import { setupLifetimeMessaging, type Lifetime } from "./lifetime";

async function getAllSettings() {
  const entries = Object.entries(settingsStorageItems) as [keyof Settings, any][];
  const resolvedEntries = await Promise.all(
    entries.map(async ([key, item]) => [key, await item.getValue()] as const),
  );
  return Object.fromEntries(resolvedEntries) as Settings;
}

function createGetAndSet<T extends keyof Settings>(
  prop: T,
  options?: { get?: boolean; set?: boolean },
) {
  const get = options?.get ?? true;
  const set = options?.set ?? true;

  const result: {
    get?: RemoveListenerCallback;
    set?: RemoveListenerCallback;
  } = {};

  if (get) {
    const getterMessage = `${prop}.get` as keyof ProtocolMap;
    result.get = onMessage(getterMessage, async () => {
      return settingsStorageItems[prop].getValue();
    });
  }

  if (set) {
    const setterMessage = `${prop}.set` as keyof ProtocolMap;
    result.set = onMessage(setterMessage, async ({ data }) => {
      await settingsStorageItems[prop].setValue(data as any);
      await settingsStorageItems[prop].setMeta({ lastModified: Date.now(), version: 1 });
    });
  }

  return result;
}

function createWatch<T extends keyof Settings>(lifetime: Lifetime, prop: T) {
  return settingsStorageItems[prop].watch(async (newValue) => {
    const update = { [prop]: newValue };

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
      return getAllSettings();
    }),
  );

  const props = Object.keys(settingsStorageItems) as (keyof Settings)[];
  for (const prop of props) {
    cleanup.push(...Object.values(createGetAndSet(prop)));
    cleanup.push(createWatch(lifetime, prop));
  }

  cleanup.push(...setupLifetimeMessaging(lifetime));

  return cleanup;
}
