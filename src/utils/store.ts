import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import type { ClassObject } from "./types";

import { onMessage, sendMessage } from "./messaging";
import { Settings } from "./settings";

interface SettingsStore extends Settings {
  ready: boolean;
  error: Error | null;
}

// to be called inside popup and content-script
export function createSettingsStore() {
  const store = create(
    subscribeWithSelector<SettingsStore>(() => ({
      ...(new Settings() as ClassObject<Settings>),
      ready: false,
      error: null,
    })),
  );

  // listen for background broadcasts
  onMessage("settings.update", ({ data }) => {
    if (import.meta.env.DEV)
      console.log("[store] log: settings update received from background: ", data);
    store.setState(data);
  });

  return store;
}

export async function fetchSettingsStore(store: ReturnType<typeof createSettingsStore>) {
  // fetch initial state from background
  return sendMessage("settings.get")
    .then((settings) => {
      if (import.meta.env.DEV)
        console.log("[store] log: settings fetched from background: ", settings);
      store.setState({ ...(settings as ClassObject<Settings>), ready: true });
    })
    .catch((e) => {
      console.error("[store] error: failed to fetch settings: ", e);
      store.setState({ error: e as Error });
    });
}
