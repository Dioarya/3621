import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import type { PartialSettings, Settings } from "./settings";

import { onMessage, sendMessage } from "./messaging";

export type SettingsStatus = "pending" | "success" | "error";

export type SettingsStore = {
  data: Settings | null;
  status: SettingsStatus;
  error: Error | null;
};

function deepMerge(target: Settings, source: PartialSettings): Settings {
  const result: Record<string, unknown> = { ...target };

  for (const key of Object.keys(source)) {
    const val = (source as unknown as Record<string, unknown>)[key];
    if (val === undefined) continue;

    if (val !== null && typeof val === "object" && !Array.isArray(val) && key in target) {
      result[key] = deepMerge(
        (target as unknown as Record<string, unknown>)[key] as unknown as Settings,
        val as unknown as PartialSettings,
      );
    } else {
      result[key] = val;
    }
  }

  return result as unknown as Settings;
}

// to be called inside popup and content-script
export function createSettingsStore() {
  const store = create(
    subscribeWithSelector<SettingsStore>(() => ({
      data: null,
      status: "pending",
      error: null,
    })),
  );

  // listen for background broadcasts
  onMessage("settings.update", ({ data }) => {
    if (import.meta.env.DEV)
      console.log("[store] log: settings update received from background: ", data);
    store.setState((state) => ({
      data: state.data ? deepMerge(state.data, data) : null,
    }));
  });

  return store;
}

export async function fetchSettingsStore(store: ReturnType<typeof createSettingsStore>) {
  if (store.getState().status !== "pending") return;
  // fetch initial state from background
  return sendMessage("settings.get")
    .then((settings) => {
      if (import.meta.env.DEV)
        console.log("[store] log: settings fetched from background: ", settings);
      store.setState({ data: settings as Settings, status: "success" });
    })
    .catch((e) => {
      console.error("[store] error: failed to fetch settings: ", e);
      store.setState({ error: e instanceof Error ? e : new Error(String(e)), status: "error" });
    });
}
