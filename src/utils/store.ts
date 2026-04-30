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
    store.setState(data);
  });

  return store;
}

export async function fetchSettingsStore(store: ReturnType<typeof createSettingsStore>) {
  // fetch initial state from background
  return sendMessage("settings.get")
    .then((settings) => store.setState({ ...(settings as ClassObject<Settings>), ready: true }))
    .catch((e) => store.setState({ error: e as Error }));
}
